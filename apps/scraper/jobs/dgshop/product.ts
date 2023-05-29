import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeDgshopProduct(data: ScrapedData) {
  console.log("Dgshop", { data });
}
