import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeFrisbeebutikkenProduct(data: ScrapedData) {
  console.log("Frisbeebutikken", { data });
}
