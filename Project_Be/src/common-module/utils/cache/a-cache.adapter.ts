import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ICacheAdapter } from "./i-cache-adapter";
import { Cache } from "cache-manager";
import { CacheUtils } from "./cache.utils";
import { NodeModulesUtils } from "../node-modules.utils";

export abstract class ACacheAdapter implements ICacheAdapter {
    private static CACHE_MANAGER_VERSION: string

    constructor(@Inject(CACHE_MANAGER) public cacheManager?: Cache, name?: string) {
        NodeModulesUtils.loadVersions();
        ACacheAdapter.CACHE_MANAGER_VERSION = NodeModulesUtils.versions['cache-manager'] || ''
        ACacheAdapter.CACHE_MANAGER_VERSION = ACacheAdapter.CACHE_MANAGER_VERSION.startsWith('4') ? '4' : ACacheAdapter.CACHE_MANAGER_VERSION
        CacheUtils.registryCacheAdapter(name ? name : cacheManager.store['name'] || 'unknown', this)
    }

    incr(key: string, ttl?: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    get<T>(key: string): Promise<T> {
        return this.cacheManager.get<T>(key)
    }

    set(key: string, value: any, ttl?: number): Promise<void> {
        ttl = ttl || 60000;
        let __ttl: any;
        let __version: string = ACacheAdapter.CACHE_MANAGER_VERSION.split('.').at(0);
        switch (__version) {
            case '4':
                ttl = ttl / 1000
                __ttl = { ttl: ttl };
                break;
            case '5':
                __ttl = ttl;
                break;
            default:
                __ttl = ttl;
                break;
        }
        return this.cacheManager.set(key, value, __ttl)
    }

    del(key: string): Promise<void> {
        return this.cacheManager.del(key);
    }

    reset(): Promise<void> {
        return this.cacheManager.reset();
    }

    wrap<T>(key: string, closure: () => Promise<T>, ttl?: number): Promise<T> {
        ttl = ttl || 60000;
        ttl = ttl / (ACacheAdapter.CACHE_MANAGER_VERSION === '4' ? 1000 : 1)
        let __ttl: any = ACacheAdapter.CACHE_MANAGER_VERSION === '4' ? { ttl: ttl } : ttl
        return this.cacheManager.wrap(key, closure, __ttl)
    }
}