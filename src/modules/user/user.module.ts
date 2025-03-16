import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { OTPEntity } from './entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OTPEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
