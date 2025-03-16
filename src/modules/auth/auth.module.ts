import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OTPEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
