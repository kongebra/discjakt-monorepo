import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

export type RobotsTxtInfo = {
  isCrawlAllowed: boolean;
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay: number;
};

@Injectable()
export class RobotsTxtService {
  private readonly logger = new Logger(RobotsTxtService.name);

  private readonly defaultInfo: RobotsTxtInfo = {
    isCrawlAllowed: true,
    allowedPaths: [],
    disallowedPaths: [],
    crawlDelay: 1,
  };

  constructor(private readonly http: HttpService) {}

  public async fetchAndParse(baseUrl: string): Promise<RobotsTxtInfo> {
    const normalizedBaseUrl = this.normalizeBaseUrl(baseUrl);
    const url = `${normalizedBaseUrl}/robots.txt`;

    const response = await this.http.axiosRef.get(url);

    if (response.status !== 200) {
      this.logger.error(
        `Error fetching robots.txt for ${url}. Status: ${response.status}`,
      );

      return this.defaultInfo;
    }

    const text = response.data;

    const parsedRobotsTxt =
      text.split('\n').filter((line: string) => line.trim() !== '') ?? [];

    // Initialize variables to store the extracted information
    let isCrawlAllowed = true;
    const allowedPaths = [];
    const disallowedPaths = [];
    let crawlDelay = 1;

    const userAgentLowerCase = 'discjaktbot';

    for (const line of parsedRobotsTxt) {
      try {
        const [field, value] = line
          .split(':')
          .map((item: string) => item.trim());
        const fieldLowerCase = field?.toLowerCase() || '';
        const valueLowerCase = value?.toLowerCase() || '';

        // Check the field and extract relevant information
        if (
          fieldLowerCase === 'user-agent' &&
          userAgentLowerCase === valueLowerCase
        ) {
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
      } catch (error) {
        // if (error instanceof TypeError) {
        //   this.logger.error(`Error parsing robots.txt line: ${line}`, error);
        // } else if (error instanceof Error) {
        // }
        this.logger.error(`Error parsing robots.txt line: ${line}`, error);
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

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
}
