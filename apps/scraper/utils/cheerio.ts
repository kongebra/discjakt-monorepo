import { CheerioAPI } from "cheerio";
import { Product, ProductPrice } from "database";

export function scrapeLdJsonProduct($: CheerioAPI) {
  let product:
    | (Pick<Product, "name" | "description" | "imageUrl"> & {
        price: Pick<ProductPrice, "availability" | "currency" | "price">;
      })
    | null = null;

  $('script[type="application/ld+json"]').each((_, element) => {
    const script = $(element).html();

    if (script?.includes('@type":"Product"')) {
      try {
        const data = JSON.parse(script);

        const title = data.mainEntity.name || "";
        const description = data.mainEntity.description || "";
        const price = data.mainEntity.offers?.price || 0;
        const currency = data.mainEntity.offers?.priceCurrency || "NOK";
        const imageUrl = data.mainEntity.image?.[0] || "";

        const availability = price ? "IN_STOCK" : "OUT_OF_STOCK";

        product = {
          name: title,
          description,
          price: {
            availability,
            currency,
            price,
          },
          imageUrl,
        };

        return false; // Exit the loop after finding the desired script
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  });

  return product as
    | (Pick<Product, "name" | "description" | "imageUrl"> & {
        price: Pick<ProductPrice, "availability" | "currency" | "price">;
      })
    | null;
}
