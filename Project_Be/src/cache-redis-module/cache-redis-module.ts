import { Module } from '@nestjs/common';
import { RedisCacheAdapter } from './services/redis-cache-adapter';
import { ConfigModule } from '@nestjs/config';
import { ConfigUtils } from 'src/app-module/utils/config.utils';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            ignoreEnvVars: true,
            validate: (config: Record<string, any>) => { return ConfigUtils.validate(config) }
        }),
    ],
    controllers: [],
    providers: [RedisCacheAdapter],
    exports: []
})

export class CacheRedisModule {
    constructor() { }
}