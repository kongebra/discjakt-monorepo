import axios, { AxiosError } from "axios";
import { CheerioAPI, load } from "cheerio";
import { ProductQueueData } from "../queue";
import logger from "./logger";
import { prisma } from "database";
import decomment from "decomment";

interface ProductResult {
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  outOfStock: boolean;
}

const isOutOfStock = ($: CheerioAPI, url: string): boolean => {
  const outOfStockSelectors = ["out-of-stock"];

  for (const selector of outOfStockSelectors) {
    if ($(`.${selector}`).length > 0) {
      return true;
    }
  }

  return false;
};

const getLDJson = (
  $: CheerioAPI,
  url: string,
  outOfStock: boolean
): ProductResult | null => {
  const scriptTags = $('script[type="application/ld+json"]');

  for (let i = 0; i < scriptTags.length; i++) {
    const childNode = scriptTags[i].children[0];

    if (childNode && childNode.type === "text") {
      let content = childNode.data || "";
      content = decomment(content);

      let json;
      try {
        json = JSON.parse(content);
      } catch (error) {
        logger.error(`Error parsing JSON from ${url}`, error);
        continue;
      }

      // If the @type is Webpage and mainEntity's @type is Product, retrieve it.
      if (
        json["@type"] === "Webpage" &&
        json.mainEntity &&
        json.mainEntity["@type"] === "Product"
      ) {
        const product = {
          name: json.mainEntity.name,
          description: json.mainEntity.description,
          price: parseFloat(json.mainEntity.offers?.price),
          currency: json.mainEntity.offers?.priceCurrency,
          imageUrl: Array.isArray(json.mainEntity.image)
            ? json.mainEntity.image[0]
            : json.mainEntity.image,
          outOfStock,
        };

        logger.debug("inside getLDJson - product: ", { product });

        return product;
      }

      if (
        json["@type"] === "Product" &&
        json.offers &&
        json.offers.length > 0
      ) {
        const product = {
          name: json.name,
          description: json.description,
          price: parseFloat(json.offers[0]?.price),
          currency: json.offers[0]?.priceCurrency || "NOK",
          imageUrl: Array.isArray(json.image) ? json.image[0] : json.image,
          outOfStock,
        };

        if (outOfStock) {
          product.price = 0;
        }

        return product;
      }
    }
  }

  return null;
};

const getOGTags = (
  $: CheerioAPI,
  url: string,
  outOfStock: boolean
): ProductResult | null => {
  const product: Partial<ProductResult> = {};

  const ogTags = $('meta[property^="og:"]');

  ogTags.each((_, element) => {
    const property = $(element).attr("property");
    const content = $(element).attr("content");

    if (!property || !content) {
      return;
    }

    switch (property) {
      case "og:title":
        product.name = content;
        break;
      case "og:description":
        product.description = content;
        break;
      case "og:image":
      case "og:image:secure_url":
        product.imageUrl = content;
        break;
      case "og:price:amount":
        product.price = parseFloat(content);
        break;
      case "og:price:currency":
        product.currency = content;
        break;
    }
  });

  // Additional tags for price and currency
  const priceContent = $('meta[property="product:price:amount"]').attr(
    "content"
  );
  if (!product.price && priceContent) {
    product.price = parseFloat(priceContent) || 0;
  }

  if (!product.currency) {
    product.currency =
      $('meta[property="product:price:currency"]').attr("content") || "NOK";
  }

  if (outOfStock) {
    product.price = 0;
  }

  if (
    !product.name ||
    !product.description ||
    (!product.price && product.price !== 0) ||
    !product.currency ||
    !product.imageUrl
  ) {
    return null;
  }

  return product as ProductResult;
};

const getCommonTags = (
  $: CheerioAPI,
  url: string,
  outOfStock: boolean
): ProductResult | null => {
  const product: Partial<ProductResult> = {};

  // Check multiple selectors for the product name
  const nameSelectors = ["h1", ".product-title", ".product-title-v1", "title"];
  for (const selector of nameSelectors) {
    const potentialName = $(selector).text().trim();
    if (potentialName) {
      product.name = potentialName;
      break;
    }
  }

  product.description =
    $('meta[name="description"]').attr("content")?.trim() || "";

  // Find price, clean it up, and convert to a number
  const priceText = $(".product-price").text();
  const priceMatch = priceText.match(/(\d[\d.,]*)/);
  if (priceMatch) {
    const price = parseFloat(priceMatch[1].replace(",", "."));
    if (!isNaN(price)) {
      product.price = price;
    }
  }

  // Check multiple selectors for the product image
  const imageSelectors = [`img[alt="${product.name}"]`, ".fit-prod-page"];
  for (const selector of imageSelectors) {
    const potentialImage = $(selector).attr("src");
    if (potentialImage) {
      product.imageUrl = potentialImage;
      break;
    }
  }

  if (outOfStock) {
    product.price = 0;
    product.currency = "NOK";
  }

  // Check if all fields are filled
  if (
    !product.name ||
    !product.description ||
    (product.price !== 0 && !product.price) ||
    !product.imageUrl
  ) {
    return null;
  }

  return product as ProductResult;
};

const combinedScraper = async (url: string): Promise<ProductResult | null> => {
  const { data: html } = await axios.get(url);
  const $ = load(html);

  const outOfStock = isOutOfStock($, url);

  logger.debug("outOfStock", { outOfStock });

  const ldJsonProduct = getLDJson($, url, outOfStock);
  logger.debug("ldJsonProduct", { ldJsonProduct });
  if (ldJsonProduct) {
    return ldJsonProduct;
  }

  const ogProduct = getOGTags($, url, outOfStock);
  logger.debug("ogProduct", { ogProduct });
  if (ogProduct) {
    return ogProduct;
  }

  const commonTagsProduct = getCommonTags($, url, outOfStock);
  logger.debug("commonTagsProduct", { commonTagsProduct });
  if (commonTagsProduct) {
    return commonTagsProduct;
  }

  return null;
};

export const scrapeProduct = async (data: ProductQueueData) => {
  try {
    const product = await combinedScraper(data.loc);
    logger.debug("combinedScraper", { product });

    if (!product) {
      logger.warn("No product found for:", { url: data.loc });
      return;
    }

    const result = await prisma.product.update({
      where: {
        loc: data.loc,
      },
      data: {
        name: product.name || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",

        prices: {
          create: {
            price: product.price || 0,
            currency: product.currency || "NOK",
            availability: product.price || 0 ? "IN_STOCK" : "OUT_OF_STOCK",
          },
        },
      },
      include: {
        prices: true,
      },
    });

    logger.debug("Product updated:", { result });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        logger.debug("404:", data.loc);
        return;
      }
    } else {
      logger.error("Error scraping product:", error);
    }
  } finally {
    prisma.$disconnect();
  }
};
