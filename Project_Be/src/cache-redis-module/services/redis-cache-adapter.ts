import { Injectable, Logger } from "@nestjs/common";
import { NodeModulesUtils } from "src/common-module/utils/node-modules.utils";
import { createClient } from 'redis';
import { ICacheAdapter } from "src/common-module/utils/cache/i-cache-adapter";
import { CacheUtils } from "src/common-module/utils/cache/cache.utils";
import * as _ from "lodash";

@Injectable()
export class RedisCacheAdapter implements ICacheAdapter {
    readonly log = new Logger(RedisCacheAdapter.name);

    private client: any;
    private readonly REDIS_HOST: string = process.env['cache.redis.host'] || 'localhost';
    private readonly REDIS_PORT: number = parseInt(process.env['cache.redis.port']) || 6379;
    private readonly REDIS_DB: number = parseInt(process.env['cache.redis.db']) || 0;

    constructor() {
        NodeModulesUtils.loadVersions();

        CacheUtils.registryCacheAdapter('redis', this, 100);

        let __version: string;
        __version = NodeModulesUtils.versions['redis'];
        this.log.log(`redis --> ${__version}`);

        let __url: string = `redis://${this.REDIS_HOST}:${this.REDIS_PORT}/${this.REDIS_DB}`;
        this.log.log(`connect to ${__url}...`);
        this.client = createClient({
            database: this.REDIS_DB,
            pingInterval: 10000,
            socket: {
                host: this.REDIS_HOST,
                port: this.REDIS_PORT,
                keepAlive: 1000,
            },
        });

        this.client.connect();
        this.client.on('error', (err: any) => {
            this.log.error(err.message);
        });
    }

    async get(key: string): Promise<any> {
        try {
            let value: string = await this.client.get(key);
            if (value === undefined || value === null) return value;

            let __value: any = JSON.parse(value)['value'];

            return __value;
        } catch (ex) {
            this.log.error(ex.message);
            return;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (ex) {
            this.log.error(ex.message);
        }
    }

    incr(key: string, ttl?: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

    async reset(): Promise<void> {
        try {
            await this.client.del('*');
        } catch (ex) {
            this.log.error(ex.message);
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            if (value === undefined || value === null) return;
            let type: string = typeof (value);
            return await this.client.set(key, JSON.stringify({
                value: value,
                type: type
            }), {
                EX: ttl / 1000
            });
        } catch (ex) {
            this.log.error(ex.message);
        }
    }

    async wrap(key: string, closure: () => Promise<any>, ttl?: number): Promise<any> {
        let value: any;
        try {
            value = await this.get(key);
            if (value === undefined || value === null) {
                value = await closure();
                await this.set(key, value, ttl);
            }
            return value;
        } catch (ex) {
            this.log.error(ex.message);
            return value;
        }
    }
}