import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';
import { hashSync, genSaltSync } from "bcrypt"
import { InjectRepository } from '@nestjs/typeorm';
import { TTokensPayload } from './types/payload';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { SignupDto } from './dto/basic.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
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
    const { accessToken, refreshToken } = this.makeTokensForUser({ id: user.id, mobile })
    return { accessToken, refreshToken, message: "You Logged-in Successfully" }
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

  makeTokensForUser(payload: TTokensPayload) {
    const accessToken = this.jwtService.sign(
      payload,
      {
        secret: this.configService.get("Jwt.accessTokenSecret"),
        expiresIn: "30d"
      })
    const refreshToken = this.jwtService.sign(
      payload,
      {
        secret: this.configService.get("Jwt.refreshTokenSecret"),
        expiresIn: "1y"
      })
    return { accessToken, refreshToken }
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TTokensPayload>(token, {
        secret: this.configService.get("Jwt.accessTokenSecret")
      })
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id })
        if (!user) throw new UnauthorizedException("Login on Your account")
        return user
      }
      throw new UnauthorizedException("Login on Your account!")
    } catch (error) {
      throw new UnauthorizedException("Login on Your account!")

    }
  }

  async signup(signupDto: SignupDto) {
    const { first_name, last_name, mobile, email, password, confirm_password } = signupDto;
    await this.checkEmail(email)
    await this.checkMobile(mobile)

    if (password !== confirm_password) throw new BadRequestException('Passwords do not match!');

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) throw new BadRequestException('Email is already in use!');

    const salt = genSaltSync(10)
    let hashedPassword = hashSync(password, salt);

    const newUser = this.userRepository.create({
      first_name,
      last_name,
      mobile,
      email,
      password: hashedPassword,
      mobile_verify: false
    });

    await this.userRepository.save(newUser);
    return { message: 'User registered successfully.' }
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email })
    if (user) throw new ConflictException("email is already exits!")
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile })
    if (user) throw new ConflictException("mobile is already exits!")
  }
}