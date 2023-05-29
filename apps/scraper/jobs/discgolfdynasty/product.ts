import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeDiscgolfDynastyProduct(data: ScrapedData) {
  console.log("DiscgolfDynasty", { data });
}
