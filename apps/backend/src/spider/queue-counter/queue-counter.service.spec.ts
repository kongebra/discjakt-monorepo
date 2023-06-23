import { Test, TestingModule } from '@nestjs/testing';
import { QueueCounterService } from './queue-counter.service';

describe('QueueCounterService', () => {
  let service: QueueCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueCounterService],
    }).compile();

    service = module.get<QueueCounterService>(QueueCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
