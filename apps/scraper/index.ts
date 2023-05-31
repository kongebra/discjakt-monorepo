import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { initQueue } from "./queue";
import { initCronJobs } from "./cron";
import { scrapeProduct } from "./utils/scraper";

// initQueue();
// initCronJobs();

scrapeProduct({
  loc: "https://aceshop.no/products/neo-evolution",
  storeId: 1,
  lastmod: new Date(0),
});
