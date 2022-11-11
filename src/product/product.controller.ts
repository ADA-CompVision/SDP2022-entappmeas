import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Roles } from "src/decorators/roles.decorator";
import { RoleGuard } from "src/guards/role.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@ApiTags("Product")
@ApiBearerAuth()
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const product = await this.productService.findOne({ id });

    if (!product) {
      throw new NotFoundException("Attribute not found");
    }

    return this.productService.findOne({ id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.findOne({ id });

    if (!product) {
      throw new NotFoundException("Attribute not found");
    }

    return this.productService.update({ id }, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    const product = await this.productService.findOne({ id });

    if (!product) {
      throw new NotFoundException("Attribute not found");
    }

    return this.productService.delete({ id });
  }
}
