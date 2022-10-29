import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AttributeService } from "./attribute.service";
import { CreateAttributeDto } from "./dto/create-attribute.dto";
import { UpdateAttributeDto } from "./dto/update-attribute.dto";

@ApiTags("Attribute")
@ApiBearerAuth()
@Controller("attribute")
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const attribute = await this.attributeService.findOne(+id);

    if (!attribute) {
      throw new NotFoundException("Attribute not found");
    }

    return this.attributeService.findOne(+id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    const attribute = await this.attributeService.findOne(+id);

    if (!attribute) {
      throw new NotFoundException("Attribute not found");
    }

    return this.attributeService.update(+id, updateAttributeDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const attribute = await this.attributeService.findOne(+id);

    if (!attribute) {
      throw new NotFoundException("Attribute not found");
    }

    return this.attributeService.delete(+id);
  }
}
