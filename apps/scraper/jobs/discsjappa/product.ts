import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeDiscsjappaProduct(data: ScrapedData) {
  console.log("Discsjappa", { data });
}
