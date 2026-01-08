import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ICacheAdapter } from './i-cache-adapter';
import { CacheUtils } from './cache.utils';

export abstract class ACacheAdapter implements ICacheAdapter {

    constructor(
        @Inject(CACHE_MANAGER)
        protected readonly cacheManager: Cache,
        name?: string,
    ) {
        const storeName =
            (cacheManager as any)?.stores?.[0]?.name || 'unknown';

        CacheUtils.registryCacheAdapter(name ?? storeName, this);
    }

    incr(key: string, ttl?: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    async get<T>(key: string): Promise<T> {
        return this.cacheManager.get<T>(key);
    }

    async set(key: string, value: any, ttl = 60000): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async reset(): Promise<void> {
        if ((this.cacheManager as any).clear) {
            await (this.cacheManager as any).clear();
        }
    }

    async wrap<T>(
        key: string,
        closure: () => Promise<T>,
        ttl = 60000,
    ): Promise<T> {
        return this.cacheManager.wrap(key, closure, ttl);
    }
}
