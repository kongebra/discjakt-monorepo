import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { initQueue } from "./queue";
import { initCronJobs } from "./cron";

initQueue();
initCronJobs();
