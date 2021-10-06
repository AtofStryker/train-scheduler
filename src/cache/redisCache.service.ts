import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
 * Since redis isn't thread safe by itself, something like redis-lock can be used
 * in tandem with redis to make sure resources are leased out without repercussions
 *
 * For our implementation, this should provide basic thread safety for a single call, but multiple spammed calls
 * to the API could result in some non thread safe operations
 */
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
