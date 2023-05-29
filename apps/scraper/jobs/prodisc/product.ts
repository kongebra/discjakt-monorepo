import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeProdiscProduct(data: ScrapedData) {
  console.log("Prodisc", { data });
}
