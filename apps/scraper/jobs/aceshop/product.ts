import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeAceshopProduct(data: ScrapedData) {
  console.log("aceshop", { data });
}
