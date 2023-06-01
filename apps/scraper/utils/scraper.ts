import axios, { AxiosError } from "axios";
import { CheerioAPI, load } from "cheerio";
import { ProductQueueData } from "../queue";
import logger from "./logger";
import type { Currency } from "database";
import { prisma } from "database";
import decomment from "decomment";

interface ProductResult {
  name: string;
  description: string;
  price: number;
  currency: Currency;
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
      const originalContent = content.toString();

      try {
        content = decomment(content);

        // Remove trailing escape characters from description field
        content = content.replace(/\\"$/, '"');

        let json;
        json = JSON.parse(content);

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
      } catch (error) {
        logger.warn(`Error parsing JSON from ${url}`, {
          error,
          content,
          originalContent,
        });
        continue;
      }
    }
  }

  return null;
};

const getProductTitle = ($: CheerioAPI, url: string): string | null => {
  const ogName = $('meta[property="og:title"]').attr("content");
  if (ogName) {
    return ogName;
  }

  const titleSelectors = [
    "h1",
    ".product-title",
    ".product_title",
    ".product-title-v1",
    "title",
    "#productTitle", // Amazon
    ".product-info-title", // Walmart
    ".product-detail-title", // Best Buy
    ".product-name", // Target
    ".product_name", // Target (alternative)
    ".product_title", // WooCommerce
    ".product_title.entry-title", // WooCommerce
    ".product_title.single-product-title", // WooCommerce
    ".productTitle", // Wix
    ".title.product-title", // Wix
    ".productTitle.product-title", // Wix
    ".product-single__title", // Shopify
    ".product-title", // Shopify
    ".product-single__title.product_title", // Shopify
    ".product_title.product-single__title", // Shopify
  ];

  for (const selector of titleSelectors) {
    try {
      const potentialTitle = $(selector).first().text().trim();
      if (potentialTitle) {
        return potentialTitle;
      }
    } catch (error) {
      // Handle any potential errors, e.g., log or ignore
      logger.error(`Error getting product title from ${url}`, { error });
    }
  }

  return null;
};

const getProductDescription = ($: CheerioAPI, url: string): string | null => {
  const ogDescription = $('meta[property="og:description"]').attr("content");
  if (ogDescription) {
    return ogDescription;
  }

  const descriptionSelectors = [
    ".product-description",
    ".product-description-container",
    ".product-detail-description",
    "#product-description",
    "#description",
    ".product-single__description", // Shopify
    ".product-single__description.rte", // Shopify
  ];

  for (const selector of descriptionSelectors) {
    try {
      const potentialDescription = $(selector).first().text().trim();
      if (potentialDescription) {
        return potentialDescription;
      }
    } catch (error) {
      // Handle any potential errors, e.g., log or ignore
      logger.error(`Error getting product description from ${url}`, { error });
    }
  }

  return null;
};

const getProductImage = ($: CheerioAPI, url: string): string | null => {
  const ogSelectors = [
    'meta[property="og:image"]',
    'meta[property="og:image:secure_url"]',
  ];
  for (const selector of ogSelectors) {
    const ogImage = $(selector).attr("content");
    if (ogImage) {
      return ogImage;
    }
  }

  const imageSelectors = [
    ".product-image",
    ".product-image-container",
    ".product-detail-image",
    "#product-image",
    ".product-single__photo", // Shopify
    ".product-single__photo.img-fluid", // Shopify
    ".product_image", // WooCommerce
    ".product_image img", // WooCommerce
    ".image-carousel-image", // Wix
    ".product-image-container img", // Wix
  ];
  for (const selector of imageSelectors) {
    try {
      const potentialImage = $(selector).first().attr("src");
      if (potentialImage) {
        return potentialImage;
      }
    } catch (error) {
      // Handle any potential errors, e.g., log or ignore
      logger.error(`Error getting product image from ${url}`, { error });
    }
  }

  return null;
};

const getProductPrice = ($: CheerioAPI, url: string): string | null => {
  const ogSelectors = [
    'meta[property="product:price:amount"]',
    'meta[property="og:price:amount"]',
  ];
  for (const selector of ogSelectors) {
    const ogPrice = $(selector).attr("content");
    if (ogPrice) {
      return ogPrice;
    }
  }

  const priceSelectors = [
    ".product-price",
    ".price",
    ".price-container",
    ".product-price-container",
    ".product-price-text",
    ".product-price span",
    ".product-price .amount",
    ".product-price .price",
    ".product-single__price", // Shopify
    ".product-single__price.price", // Shopify
  ];

  for (const selector of priceSelectors) {
    try {
      const potentialPrice = $(selector).first().text().trim();
      if (potentialPrice) {
        return potentialPrice;
      }
    } catch (error) {
      // Handle any potential errors, e.g., log or ignore
      logger.error(`Error getting product price from ${url}`, { error });
    }
  }

  return null;
};

const getProductCurrency = ($: CheerioAPI, url: string): Currency | null => {
  const ogSelectors = [
    'meta[property="product:price:currency"]',
    'meta[property="og:price:currency"]',
  ];
  for (const selector of ogSelectors) {
    const ogCurrency = $(selector).attr("content");
    if (ogCurrency) {
      return ogCurrency as Currency;
    }
  }

  const currencySelectors = [
    ".currency-symbol",
    ".product-price .currency",
    ".product-price .currency-symbol",
    ".product-single__price .money .currency",
    ".product-single__price .money .currency-symbol",
    ".woocommerce-Price-currencySymbol",
    ".price .woocommerce-Price-currencySymbol",
    ".price-symbol",
    ".product-price-symbol",
    ".money .currency",
    ".money .currency-symbol",
  ];

  for (const selector of currencySelectors) {
    try {
      const potentialCurrency = $(selector).first().text().trim();
      if (potentialCurrency) {
        return potentialCurrency as Currency;
      }
    } catch (error) {
      // Handle any potential errors, e.g., log or ignore
      logger.error(`Error getting product currency from ${url}`, { error });
    }
  }

  return null;
};

const getProductInfo = ($: CheerioAPI, url: string) => {
  const product: Partial<ProductResult> = {};

  const title = getProductTitle($, url);
  if (title) {
    product.name = title;
  }

  const description = getProductDescription($, url);
  if (description) {
    product.description = description;
  }

  const imageUrl = getProductImage($, url);
  if (imageUrl) {
    product.imageUrl = imageUrl;
  }

  const priceStr = getProductPrice($, url);
  if (priceStr) {
    const priceNUm = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(priceNUm)) {
      product.price = priceNUm;
    } else {
      product.price = 0;
    }
  }

  const currency = getProductCurrency($, url);
  if (currency) {
    product.currency = currency;
  } else {
    // Default to NOK if no currency is found
    product.currency = "NOK";
  }

  if (currency?.trim().toLowerCase() === "kr") {
    product.currency = "NOK";
  }

  product.outOfStock = isOutOfStock($, url);

  return product;
};

const combinedScraper = async (url: string): Promise<ProductResult | null> => {
  const { data: html } = await axios.get(url);
  const $ = load(html);

  const outOfStock = isOutOfStock($, url);

  const ldJsonProduct = getLDJson($, url, outOfStock);
  if (ldJsonProduct) {
    return ldJsonProduct;
  }

  const product = getProductInfo($, url);
  if (!product.description) {
    // description is not required
    product.description = "";
  }

  if (product.outOfStock && !product.price) {
    product.price = 0;
  }

  if (product.name && product.imageUrl) {
    return product as ProductResult;
  }

  logger.warn(`No product found for ${url}:`, { product });
  return null;
};

export const scrapeProduct = async (data: ProductQueueData) => {
  try {
    const product = await combinedScraper(data.loc);

    if (!product) {
      await prisma.product.update({
        where: {
          loc: data.loc,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return;
    }

    await prisma.product.update({
      where: {
        loc: data.loc,
      },
      data: {
        name: product.name || "none",
        description: product.description || "none",
        imageUrl: product.imageUrl || "none",

        prices: {
          create: [
            {
              price: product.price || 0,
              currency: product.currency || "NOK",
              availability: product.outOfStock ? "OutOfStock" : "InStock",
            },
          ],
        },
      },
    });

    logger.info("Scraped product:", { loc: data.loc });
  } catch (error) {
    if (
      (error as any)?.status === 404 ||
      (error as any)?.message.includes("404")
    ) {
      await prisma.product.update({
        where: {
          loc: data.loc,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      logger.info("Product not found HTTP 404 (scrapeProduct):", {
        loc: data.loc,
      });

      return;
    }

    logger.error("Error scraping product (scrapeProduct):", {
      loc: data.loc,
      error,
    });
  }
};
