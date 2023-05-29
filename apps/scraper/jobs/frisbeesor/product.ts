import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeFrisbeesorProduct(data: ScrapedData) {
  console.log("Frisbeesor", { data });
}
