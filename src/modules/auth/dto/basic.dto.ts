import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";

export class SignupDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsMobilePhone("fa-IR", {}, { message: "Your Phone format is incorrect!" })
  mobile: string;
  @IsString()
  @IsEmail({}, { message: "Your email format is incorrect!" })
  email: string;
  @IsString()
  @Length(6, 20, { message: "Your Password is incorrect!" })
  password: string
  @IsString()
  confirm_password: string
}

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: "Your email format is incorrect!" })
  email: string;

  @IsString()
  @Length(6, 20, { message: "Your password must be between 6 and 20 characters!" })
  password: string;
}