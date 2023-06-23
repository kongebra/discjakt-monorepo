import axios, { type AxiosRequestConfig } from 'axios';

export type RobotsTxtInfo = {
  isCrawlAllowed: boolean;
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay: number | null;
};

/**
 * Fetches the robots.txt file from the specified URL asynchronously.
 * @param url - The URL of the website to fetch the robots.txt file from.
 * @param config - Optional Axios request configuration.
 * @returns A promise that resolves to the robots.txt content.
 * @throws If there is an error while fetching the robots.txt file.
 */
export async function fetchRobotsTxtAsync(url: string, config?: AxiosRequestConfig) {
  const robotsUrl = new URL('/robots.txt', url);

  const response = await axios.get(robotsUrl.toString(), config);
  if (response.status !== 200) {
    throw new Error(`Error fetching robots.txt for ${url}. Status: ${response.status}`);
  }

  return response.data;
}

/**
 * Parses the robots.txt content and extracts information about crawl permissions, allowed/disallowed paths, and crawl delay.
 * @param robotsTxt - The content of the robots.txt file.
 * @param userAgent - Optional user agent string. If specified, checks user agent specific rules.
 * @returns An object containing information about crawl permissions, allowed/disallowed paths, and crawl delay.
 */
export function parseRobotsTxt(robotsTxt: string, userAgent: string = '*'): RobotsTxtInfo {
  const parsedRobotsTxt = robotsTxt.split('\n').filter((line) => line.trim() !== '') ?? [];

  // Initialize variables to store the extracted information
  let isCrawlAllowed = true;
  const allowedPaths = [];
  const disallowedPaths = [];
  let crawlDelay = null;

  const userAgentLowerCase = userAgent?.toLowerCase();

  for (const line of parsedRobotsTxt) {
    const [field, value] = line.split(':').map((item) => item.trim());
    const fieldLowerCase = field.toLowerCase();
    const valueLowerCase = value.toLowerCase();

    // Check the field and extract relevant information
    if (fieldLowerCase === 'user-agent' && userAgentLowerCase === valueLowerCase) {
      // User-agent field matches the provided user agent or no user agent is specified
      isCrawlAllowed = true; // By default, assume crawling is allowed for the specified user agent
    } else if (fieldLowerCase === 'disallow' && isCrawlAllowed) {
      // Disallow field, add the disallowed paths
      disallowedPaths.push(value);
    } else if (fieldLowerCase === 'allow' && isCrawlAllowed) {
      // Allow field, add the allowed paths
      allowedPaths.push(value);
    } else if (fieldLowerCase === 'crawl-delay' && isCrawlAllowed) {
      // Crawl-delay field, extract the delay value
      crawlDelay = parseFloat(value);
    }
  }

  // Return the extracted information as an object
  return {
    isCrawlAllowed,
    allowedPaths,
    disallowedPaths,
    crawlDelay,
  };
}
