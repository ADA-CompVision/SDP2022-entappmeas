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
import { Public } from "src/decorators/public.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { RoleGuard } from "src/guards/role.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCurrencyDto } from "./dto/create-currency.dto";
import { UpdateCurrencyDto } from "./dto/update-currency";

@ApiTags("Currency")
@ApiBearerAuth()
@Controller("currency")
export class CurrencyController {
  constructor(private readonly prismaService: PrismaService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.prismaService.currency.create({
      data: createCurrencyDto,
    });
  }

  @Public()
  @Get()
  async findAll() {
    return this.prismaService.currency.findMany();
  }

  @Public()
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const currency = await this.prismaService.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException("Currency not found");
    }

    return currency;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    const currency = await this.prismaService.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException("Currency not found");
    }

    return this.prismaService.currency.update({
      data: updateCurrencyDto,
      where: { id },
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    const currency = await this.prismaService.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException("Currency not found");
    }

    return this.prismaService.currency.delete({
      where: { id },
    });
  }
}
