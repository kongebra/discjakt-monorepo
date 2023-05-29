import process from "node:process";
import * as path from "node:path";
import Bree from "bree";
import fs from "node:fs";
import Graceful from "@ladjs/graceful";
import { parentPort } from "node:worker_threads";

// get all directory names in the jobs folder
const sitemaps = fs
  .readdirSync(path.join(__dirname, "jobs"), { withFileTypes: true })
  .map((value) => {
    return {
      name: `${value.name}/sitemap`,
      interval: "1h",
      timeout: 0,
    };
  });

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
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

(async () => {
  await bree.start();
})();
