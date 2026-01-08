import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ACacheAdapter } from './a-cache.adapter';

@Injectable()
export class MemCacheAdapter extends ACacheAdapter {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(cacheManager, 'mem-cache');
  }
}
