import { CustomConfigModule } from './config/configs.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
