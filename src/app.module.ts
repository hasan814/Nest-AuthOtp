import { CustomConfigModule } from './config/configs.module';
import { TypeOrmDbConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig]
    })],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule { }
