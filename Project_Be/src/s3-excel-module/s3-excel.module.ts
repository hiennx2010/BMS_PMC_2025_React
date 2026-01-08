import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { CommonModule } from 'src/common-module/common.module';
import { ModuleRefUtils } from 'src/common-module/utils/module-ref.utils';

import { ConfigModule } from '@nestjs/config';
import { ConfigUtils } from 'src/app-module/utils/config.utils';

import { S3FsExcelDefaultAdapter } from './service/file/s3-fs-excel-default.adapter';

/**
 * 
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            ignoreEnvVars: true,
            validate: (config: Record<string, any>) => { return ConfigUtils.validate(config) }
        }),
        CommonModule
    ],
    controllers: [],
    providers: [S3FsExcelDefaultAdapter],
    exports: [

    ]
})
export class S3ExcelModule {
    constructor(moduleRef: ModuleRef) {
        ModuleRefUtils.registerModuleRef(S3ExcelModule.name, moduleRef);
    }
}
