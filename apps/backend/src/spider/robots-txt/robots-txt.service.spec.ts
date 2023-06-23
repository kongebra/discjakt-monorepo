import { Test, TestingModule } from '@nestjs/testing';
import { RobotsTxtService } from './robots-txt.service';

describe('RobotsTxtService', () => {
  let service: RobotsTxtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotsTxtService],
    }).compile();

    service = module.get<RobotsTxtService>(RobotsTxtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
