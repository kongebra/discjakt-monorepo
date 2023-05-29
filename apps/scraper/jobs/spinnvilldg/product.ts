import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeSpinnvilldgProduct(data: ScrapedData) {
  console.log("Spinnvilldg", { data });
}
