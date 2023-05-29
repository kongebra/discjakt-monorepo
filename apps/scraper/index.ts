import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import process from "node:process";
import * as path from "node:path";
import Bree from "bree";
import fs from "node:fs";
import Graceful from "@ladjs/graceful";
import logger from "./utils/logger";
import { productQueue } from "./queue";

// get all directory names in the jobs folder
const sitemaps = fs
  .readdirSync(path.join(__dirname, "jobs"), { withFileTypes: true })
  .map((value, index) => {
    return {
      name: `${value.name}/sitemap`,
      interval: "1h",
      timeout: index * 1000 * 60, // 1 minute time per
    };
  });

// const sitemaps = [
//   {
//     name: "discgolfdynasty/sitemap",
//     interval: "1h",
//     timeout: 0,
//   },
// ];

// bree: Cron jobs
const bree = new Bree({
  /**
   * Always set the root option when doing any type of
   * compiling with bree. This just makes it clearer where
   * bree should resolve the jobs folder from. By default it
   * resolves to the jobs folder relative to where the program
   * is executed.
   */
  root: path.join(__dirname, "jobs"),
  /**
   * We only need the default extension to be "ts"
   * when we are running the app with ts-node - otherwise
   * the compiled-to-js code still needs to use JS
   */
  defaultExtension: process.env.TS_NODE ? "ts" : "js",
  jobs: [...sitemaps],
  logger: logger,
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

productQueue.on("completed", async (job) => {
  logger.debug(`Job completed: ${job.id}`);
});

(async () => {
  await bree.start();
})();
