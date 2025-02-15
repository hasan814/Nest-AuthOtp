import { CustomConfigModule } from './config/configs.module';
import { TypeOrmDbConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig]
    }),
    UserModule],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule { }
