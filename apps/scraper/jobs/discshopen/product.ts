import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeDiscshopenProduct(data: ScrapedData) {
  console.log("Discshopen", { data });
}
