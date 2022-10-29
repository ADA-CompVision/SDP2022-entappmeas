import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
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
}
