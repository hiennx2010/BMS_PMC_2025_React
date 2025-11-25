import { Module } from '@nestjs/common';
import { OpenAPIGuard } from './guard/open-api.guard';
import { CommonModule } from 'src/common-module/common.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigUtils } from 'src/app-module/utils/config.utils';

/**
 *
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvVars: true,
      validate: (config: Record<string, any>) => {
        return ConfigUtils.validate(config);
      },
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [OpenAPIGuard],
  exports: [OpenAPIGuard],
})
export class OpenAPIModule {}
