import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
  IsAlphanumeric,
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsMobilePhone("az-AZ")
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 6,
    maxLength: 256,
  })
  @IsAlphanumeric()
  @MinLength(6)
  @MaxLength(256)
  username: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 256,
  })
  @MinLength(8)
  @MaxLength(256)
  password: string;

  @ApiProperty({
    enum: Role,
  })
  @IsOptional()
  @IsIn(Object.values(Role))
  role: Role;
}
