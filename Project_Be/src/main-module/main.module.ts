import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common-module/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), CommonModule, MainModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class MainModule {}
