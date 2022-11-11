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
import { AttributeService } from "./attribute.service";
import { CreateAttributeDto } from "./dto/create-attribute.dto";
import { UpdateAttributeDto } from "./dto/update-attribute.dto";

@ApiTags("Attribute")
@ApiBearerAuth()
@Controller("attribute")
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  async findAll() {
    return this.attributeService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const attribute = await this.attributeService.findOne({ id });

    if (!attribute) {
      throw new NotFoundException("Attribute not found");
    }

    return this.attributeService.findOne({ id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributeService.update({ id }, updateAttributeDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    const attribute = await this.attributeService.findOne({ id });

    if (!attribute) {
      throw new NotFoundException("Attribute not found");
    }

    return this.attributeService.delete({ id });
  }
}
