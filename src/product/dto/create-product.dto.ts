import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class ProductAttribute {
  @ApiProperty()
  @IsString()
  attributeId: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ isArray: true, type: ProductAttribute, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  attributes: ProductAttribute[];
}
