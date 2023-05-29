import axios, { AxiosError } from "axios";
import { CheerioAPI, load } from "cheerio";
import { ProductQueueData } from "../queue";
import logger from "./logger";
import { prisma } from "database";

interface ProductResult {
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
}

const getLDJson = ($: CheerioAPI): ProductResult | null => {
  const scriptTags = $('script[type="application/ld+json"]');

  for (let i = 0; i < scriptTags.length; i++) {
    const childNode = scriptTags[i].children[0];

    if (childNode && childNode.type === "text") {
      const content = childNode.data || "";
      const json = JSON.parse(content);

      // If the @type is Webpage and mainEntity's @type is Product, retrieve it.
      if (
        json["@type"] === "Webpage" &&
        json.mainEntity &&
        json.mainEntity["@type"] === "Product"
      ) {
        return {
          name: json.mainEntity.name,
          description: json.mainEntity.description,
          price: parseFloat(json.mainEntity.offers?.price),
          currency: json.mainEntity.offers?.priceCurrency,
          imageUrl: json.mainEntity.image[0], // image is an array here
        };
      }

      if (
        json["@type"] === "Product" &&
        json.offers &&
        json.offers.length > 0
      ) {
        return {
          name: json.name,
          description: json.description,
          price: parseFloat(json.offers[0]?.price),
          currency: json.offers[0]?.priceCurrency,
          imageUrl: json.image,
        };
      }
    }
  }

  return null;
};

const getOGTags = ($: CheerioAPI): ProductResult | null => {
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
  if (priceContent) {
    product.price = parseFloat(priceContent);
  }
  product.currency = $('meta[property="product:price:currency"]').attr(
    "content"
  );

  if (
    !product.name ||
    !product.description ||
    !product.price ||
    !product.currency ||
    !product.imageUrl
  ) {
    return null;
  }

  return product as ProductResult;
};

const getCommonTags = ($: CheerioAPI): ProductResult | null => {
  const product: Partial<ProductResult> = {};

  product.name = $("h1").text().trim() || "";

  if (!product.name) {
    product.name = $(".product-title").text().trim() || "";
  }

  if (!product.name) {
    product.name = $(".product-title-v1").text().trim() || "";
  }

  product.description =
    $('meta[name="description"]').attr("content")?.trim() || "";

  const firstPriceStr =
    $(".product-price")
      .text()
      .replaceAll(",-", "")
      .replaceAll("kr", "")
      .trim() || "";
  if (firstPriceStr) {
    const firstPriceNum = parseFloat(firstPriceStr);
    if (!isNaN(firstPriceNum)) {
      product.price = firstPriceNum;
    }
  }

  const imageOne = $(`img[alt="${product.name}"`).attr("src");
  if (imageOne) {
    product.imageUrl = imageOne;
  }

  const imageTwo = $(".fit-prod-page").attr("src");
  if (imageTwo) {
    product.imageUrl = imageTwo;
  }

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

  const ldJsonProduct = getLDJson($);
  if (ldJsonProduct) {
    return ldJsonProduct;
  }

  const ogProduct = getOGTags($);
  if (ogProduct) {
    return ogProduct;
  }

  const commonTagsProduct = getCommonTags($);
  if (commonTagsProduct) {
    return commonTagsProduct;
  }

  return null;
};

export const scrapeProduct = async (data: ProductQueueData) => {
  try {
    const product = await combinedScraper(data.loc);

    if (!product) {
      logger.warn("No product found for:", data.loc);
      return;
    }

    await prisma.product.update({
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
    });
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
