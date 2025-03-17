import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
  IsMobilePhone
} from "class-validator";

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  last_name: string;

  @IsMobilePhone("fa-IR", {}, { message: "Your Phone Number Format is Incorrect!" })
  mobile: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(32, { message: "Password must be at most 32 characters long" })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
  })
  password: string;

  @ValidateIf((o) => o.password !== undefined)
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}


export class LoginDto {
  @IsString()
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(32, { message: "Password must be at most 32 characters long" })
  password: string;
}