import {
  IsAlphanumeric,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  address: string;

  @IsMobilePhone()
  phone: string;

  @IsEmail()
  email: string;

  @IsAlphanumeric()
  @MinLength(6)
  @MaxLength(256)
  username: string;

  @MinLength(8)
  @MaxLength(256)
  password: string;
}
