import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>
  ) { }
  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto
    let user = await this.userRepository.findOneBy({ mobile })
    if (!user) {
      user = this.userRepository.create({ mobile })
      user = await this.userRepository.save(user)
    }
    await this.createOtpForUser(user)
    return { message: "Sent Code Successfully" }
  }
  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto
    const now = new Date()
    const user = await this.userRepository.findOne({ where: { mobile }, relations: { otp: true } })
    if (!user || !user?.otp) throw new UnauthorizedException("Not Found Account!")
    const otp = user?.otp
    if (otp?.code !== code) throw new UnauthorizedException("Otp code is incorrect!")
    if (otp.expires_in < now) throw new UnauthorizedException("OTP code is expired")
    if (!user.mobile_verify) {
      await this.userRepository.update({ id: user.id }, { mobile_verify: true })
    }
    return { message: "You Logged-in Successfully" }
  }

  async createOtpForUser(user: UserEntity) {
    const code = randomInt(10000, 99999).toString()
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2)
    let otp = await this.otpRepository.findOneBy({ userId: user.id })
    if (otp) {
      if (otp.expires_in > new Date()) throw new BadRequestException("OTP code not expired")
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expiresIn,
        userId: user.id
      })
    }
    otp = await this.otpRepository.save(otp)
    user.otpId = otp.id
    await this.userRepository.save(user)
  }
}