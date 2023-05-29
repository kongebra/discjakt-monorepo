import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeStarframeProduct(data: ScrapedData) {
  console.log("Starframe", { data });
}
