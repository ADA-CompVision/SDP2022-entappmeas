import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCurrencyDto {
  @ApiProperty()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsNotEmpty()
  acronym: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
