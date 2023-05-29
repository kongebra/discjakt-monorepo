import Queue from "bull";
import { ScrapedData } from "database";

export async function scrapeWearediscgolfProduct(data: ScrapedData) {
  console.log("wearediscgolf", { data });
}
