import axios from "axios";
import { load } from "cheerio";
import logger from "../../utils/logger";
import type { Product } from "database";
import { prisma } from "database";
import { ProductQueueData } from "../../queue";

export async function scrapeDgshopProduct(data: ProductQueueData) {
  logger.debug("Dgshop", { data });

  try {
    const response = await axios.get(data.loc);
    const html = response.data;

    const $ = load(html);

    // Extract the title
    const title = $('meta[property="og:title"]').attr("content") || "";

    // Extract the description
    const description =
      $('meta[property="og:description"]').attr("content") || "";

    // Extract the price
    const priceStr =
      $('meta[property="product:price:amount"]').attr("content") || "0";
    const currency =
      $('meta[property="product:price:currency"]').attr("content") || "NOK";

    // Extract the image URL
    const imageUrl = $('meta[property="og:image"]').attr("content");

    let availability = "IN_STOCK";
    let price = Number(priceStr);
    if (isNaN(price)) {
      price = 0;
      availability = "OUT_OF_STOCK"; // TODO: Sjekk om dette blir riktig
    }

    await prisma.product.update({
      where: {
        loc: data.loc,
      },
      data: {
        name: title,
        description,
        imageUrl,

        prices: {
          create: {
            price,
            currency,
            availability,
          },
        },
      },
    });
  } catch (error) {
    logger.error("Error:", error);
  }
}
