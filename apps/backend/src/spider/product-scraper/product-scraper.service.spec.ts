import { Test, TestingModule } from '@nestjs/testing';
import { ProductScraperService } from './product-scraper.service';

describe('ProductScraperService', () => {
  let service: ProductScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductScraperService],
    }).compile();

    service = module.get<ProductScraperService>(ProductScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
