import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common-module/common.module';
import { thucTapController } from './controller/thuc-tap/thuc-tap.controller';
import { thucTapService } from './service/thuc-tap/thuc-tap.service';
import { thucTap } from './entity/thuc-tap/thuc-tap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([thucTap]), CommonModule, MainModule],
  controllers: [thucTapController],
  providers: [thucTapService],
  exports: [TypeOrmModule],
})
export class MainModule {}
