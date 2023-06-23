import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Param } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ProductScraperService } from './product-scraper/product-scraper.service';
import { QueueCounterService } from './queue-counter/queue-counter.service';
import { RobotsTxtService } from './robots-txt/robots-txt.service';
import { ScheduleService } from './schedule/schedule.service';
import { SitemapService } from './sitemap/sitemap.service';

@Controller('spider')
export class SpiderController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sitemapService: SitemapService,
    private readonly robotsTxtService: RobotsTxtService,
    private readonly productScaper: ProductScraperService,
    private readonly scheduleService: ScheduleService,
    private readonly queueCounterService: QueueCounterService,
    @InjectQueue('product') private readonly productQueue: Queue,
  ) {}

  @Get('sitemap/:slug')
  async sitemapCrawl(@Param('slug') slug: string) {
    const start = new Date().getTime();

    const store = await this.prisma.store.findUnique({
      where: {
        slug,
      },
    });

    if (!store) {
      return {
        success: false,
        message: 'Store not found',
      };
    }

    const sitemapItems = await this.sitemapService.fetchAndParse(store.url);

    const end = new Date().getTime();
    const diff = end - start;

    return {
      success: true,
      message: 'Store sitemap crawled successfully',
      count: sitemapItems.length,

      time: `${diff}ms`,
    };
  }

  @Get('robotsTxt/:slug')
  async robotsTxtCrawl(@Param('slug') slug: string) {
    const start = new Date().getTime();

    const store = await this.prisma.store.findUnique({
      where: {
        slug,
      },
    });

    if (!store) {
      return {
        success: false,
        message: 'Store not found',
      };
    }

    const robotsTxtInfo = await this.robotsTxtService.fetchAndParse(store.url);

    const end = new Date().getTime();
    const diff = end - start;

    return {
      success: true,
      message: 'Store sitemap crawled successfully',

      data: robotsTxtInfo,

      time: `${diff}ms`,
    };
  }

  @Get('scrape/:loc')
  async scrape(@Param('loc') loc: string) {
    const start = new Date().getTime();
    try {
      const product = await this.productScaper.scrapeProduct(loc);

      const end = new Date().getTime();
      const diff = end - start;

      return {
        success: true,
        message: 'Product scraped successfully',

        product,

        time: `${diff}ms`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Product scrape failed',

        error: error.message,

        time: `${new Date().getTime() - start}ms`,
      };
    }
  }

  @Get('schedule/:slug')
  async schedule(@Param('slug') slug: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        slug,
      },
      include: {
        products: true,
      },
    });

    if (!store) {
      return {
        success: false,
        message: 'Store not found',
        data: {
          slug,
        },
      };
    }

    this.scheduleService.storeHandler(store);

    return {
      success: true,
      message: 'Schedule started',
      data: {
        slug,
        productsCount: store.products.length,
      },
    };
  }

  @Get('queue/info')
  async queueInfo() {
    const count = await this.productQueue.count();
    const queueCounters = this.queueCounterService.getCounters();

    return {
      success: true,
      message: 'Queue info',
      data: {
        count,

        queueCounters,
      },
    };
  }
}
