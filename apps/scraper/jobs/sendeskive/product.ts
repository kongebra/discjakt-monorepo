import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeSendskiveProduct(data: ScrapedData) {
  console.log("Sendskive", { data });
}
