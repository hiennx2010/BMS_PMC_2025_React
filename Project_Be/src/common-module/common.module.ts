import { CacheModule, INestApplication, Module } from '@nestjs/common';
import { JwtProvider } from './utils/auth-provider/jwt.provider';
import { RestTemplate } from './utils/rest-template/rest-template.utils';
import * as moment from 'moment';
import { MemCacheAdapter } from './utils/cache/mem-cache-adapter';
import { NodeModulesUtils } from './utils/node-modules.utils';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { ModuleRefUtils } from './utils/module-ref.utils';
import { LocalFsAdapter } from './utils/file/local-fs.adapter';
import { DynamicGuard } from './guard/dynamic.guard';
import { AfterAppCreatedUtils } from 'src/app-module/utils/configuration/after-app-created.utils';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { FilterUtils } from 'src/app-module/utils/filter/filter.utils';

@Module({
    imports: [CacheModule.register()],
    providers: [
        JwtProvider, LocalFsAdapter, RestTemplate, MemCacheAdapter,
        {
            provide: APP_GUARD,
            useClass: DynamicGuard,
        },
    ],
    exports: [JwtProvider, RestTemplate, MemCacheAdapter]
})
export class CommonModule {
    constructor(moduleRef: ModuleRef) {
        ModuleRefUtils.registerModuleRef(CommonModule.name, moduleRef);

        NodeModulesUtils.loadVersions();

        Date.prototype.toJSON = function () {
            return moment(this).format();
        }

        AfterAppCreatedUtils.registerCallback(async (app: INestApplication) => {
            app.useGlobalFilters(new HttpExceptionFilter());
        })
    }
}
