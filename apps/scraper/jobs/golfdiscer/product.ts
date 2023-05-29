import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeGolfdiscerProduct(data: ScrapedData) {
  console.log("Golfdiscer", { data });
}
