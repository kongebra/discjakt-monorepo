import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ProductScraperService } from './product-scraper/product-scraper.service';
import { ProductProcessor } from './product.processor';
import { QueueCounterService } from './queue-counter/queue-counter.service';
import { RobotsTxtService } from './robots-txt/robots-txt.service';
import { ScheduleService } from './schedule/schedule.service';
import { SitemapService } from './sitemap/sitemap.service';
import { SpiderController } from './spider.controller';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'product',
    }),

    ScheduleModule.forRoot(),

    HttpModule,
  ],
  controllers: [SpiderController],
  providers: [
    SpiderController,
    ProductProcessor,
    SitemapService,
    ScheduleService,
    RobotsTxtService,
    QueueCounterService,
    ProductScraperService,
    PrismaService,
  ],
  exports: [],
})
export class SpiderModule {}
