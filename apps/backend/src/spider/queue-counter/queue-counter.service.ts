import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueCounterService {
  private readonly counters: Map<number, number> = new Map();

  public increment(storeId: number): void {
    const count = this.counters.get(storeId) || 0;
    this.counters.set(storeId, count + 1);
  }

  public decrement(storeId: number): void {
    const count = this.counters.get(storeId);
    if (count !== undefined) {
      this.counters.set(storeId, count - 1);
    }
  }

  public getCount(storeId: number): number {
    return this.counters.get(storeId) || 0;
  }

  public getCounters() {
    return this.counters;
  }
}
