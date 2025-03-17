import { CustomConfigModule } from './modules/config/config.module';
import { TypeOrmDbConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig]
    }),
    UserModule,
    AuthModule,
    JwtModule
  ],
  controllers: [],
  providers: [TypeOrmDbConfig],
})

export class AppModule { }
