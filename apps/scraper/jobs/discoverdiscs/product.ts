import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeDiscoverDiscsProduct(data: ScrapedData) {
  console.log("DiscoverDiscs", { data });
}
