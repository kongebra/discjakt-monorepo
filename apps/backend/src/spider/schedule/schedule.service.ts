import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { Product, Store } from 'database';
import { PrismaService } from '../../prisma/prisma.service';
import { QueueCounterService } from '../queue-counter/queue-counter.service';
import {
  RobotsTxtInfo,
  RobotsTxtService,
} from '../robots-txt/robots-txt.service';
import { SitemapService } from '../sitemap/sitemap.service';
import { SitemapItem } from '../types';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sitemapService: SitemapService,
    private readonly queueCounterService: QueueCounterService,
    private readonly robotsTxtService: RobotsTxtService,
    @InjectQueue('product') private readonly productQueue: Queue,
  ) {}

  @Cron('0 */5 * * * *')
  async sitemaps() {
    this.logger.debug('Running sitemaps cron job');

    const stores = await this.prisma.store.findMany({
      include: {
        products: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 1,
    });

    this.logger.debug(`Found ${stores.length} stores`);

    for (const store of stores) {
      await this.prisma.store.update({
        where: {
          id: store.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      await this.storeHandler(store);
    }
  }

  public async storeHandler(store: Store & { products: Product[] }) {
    this.logger.debug(`Processing store ${store.name}`);

    const robotsTxt = await this.robotsTxtService.fetchAndParse(store.url);
    const items = await this.sitemapService.fetchAndParse(store.url);

    const filteredItems = items.filter((item) => {
      return this.sitemmapItemFilter(item, store);
    });

    this.logger.debug(
      `Found ${filteredItems.length}/${items.length} items in sitemap`,
    );

    const productMap = new Map<string, Product>();
    for (const product of store.products) {
      productMap.set(product.loc, product);
    }

    for (const item of filteredItems) {
      const found = productMap.get(item.loc);
      if (found) {
        const foundLastmod = new Date(found.lastmod).getTime();
        const itemLastmod = new Date(item.lastmod).getTime();

        if (foundLastmod !== itemLastmod) {
          this.enqueueProduct(store, item, robotsTxt);
        }
      } else {
        this.enqueueProduct(store, item, robotsTxt);
      }
    }
  }

  private async enqueueProduct(
    store: Store & { products: Product[] },
    item: SitemapItem,
    robotsTxt: RobotsTxtInfo,
  ) {
    const queueCounter = this.queueCounterService.getCount(store.id);
    this.queueCounterService.increment(store.id);

    await this.productQueue.add(
      'product',
      {
        storeId: store.id,
        loc: item.loc,
        lastmod: item.lastmod,
      },
      {
        delay: queueCounter * 1000 * robotsTxt.crawlDelay,
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 1,
      },
    );
  }

  private sitemmapItemFilter(
    { loc, priority }: SitemapItem,
    store: Store,
  ): boolean {
    if (loc === store.url) {
      return false;
    }

    switch (store.slug) {
      case 'aceshop':
      case 'frisbeebutikken':
      case 'discsjappa':
      case 'discgolfdynasty':
      case 'krokholdgs':
      case 'golfdiscer':
      case 'sendeskive':
        return loc.includes('/products/');
      case 'prodisc':
      case 'wearediscgolf':
      case 'firsbeesor':
      case 'discshopen':
        return loc.includes('/produkt/');
      case 'dgshop':
        return priority === '1.0';
      case 'discgolf-wheelie':
        return loc.includes('/butikkkatalog/');
      case 'spinnvilldg':
        return loc.includes('/product-page/');
    }

    return true;
  }
}
