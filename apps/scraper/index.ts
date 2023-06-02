import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { initQueue } from "./queue";
import { initCronJobs } from "./cron";
import axios from "axios";
// import { scrapeProduct } from "./utils/scraper";

axios.interceptors.request.use((req) => {
  req.headers.setUserAgent("discjaktbot/1.0 (+https://discjakt.no)");

  return req;
});

initQueue();
initCronJobs();

// scrapeProduct({
//   loc: "https://discoverdiscs.no/products/innova-go-bag",
//   storeId: 2,
//   lastmod: new Date(0),
// });
