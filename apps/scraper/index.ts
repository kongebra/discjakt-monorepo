import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { initCronJobs } from './cron';

// axios.interceptors.request.use((req) => {
//   req.headers.setUserAgent('discjaktbot/1.0 (+https://discjakt.no)');

//   return req;
// });

// initQueue();
initCronJobs();
