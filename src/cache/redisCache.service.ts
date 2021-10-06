import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async fetch(key: string): Promise<string[]> {
    const value = await this.cache.get(key);
    return value || [];
  }

  // the instructions say to have this method accept any type, but for sanitization I felt it was easier to have it always return an array of strings
  async set(key: string, value: string[]): Promise<void> {
    await this.cache.set(key, value);
    return undefined;
  }

  async keys(): Promise<string[]> {
    const keys = await this.cache.keys();
    return keys;
  }
}
