import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAttributeDto } from "./dto/create-attribute.dto";
import { UpdateAttributeDto } from "./dto/update-attribute.dto";

@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttributeDto: CreateAttributeDto) {
    const { categories, ...rest } = createAttributeDto;

    return this.prisma.attribute.create({
      data: {
        ...rest,
        categories: {
          connect: categories?.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async findAll() {
    return this.prisma.attribute.findMany({
      include: {
        categories: true,
      },
    });
  }

  async findOne(attributeWhereUniqueInput: Prisma.AttributeWhereUniqueInput) {
    return this.prisma.attribute.findUnique({
      where: attributeWhereUniqueInput,
      include: { categories: true },
    });
  }

  async update(
    attributeWhereUniqueInput: Prisma.AttributeWhereUniqueInput,
    updateAttributeDto: UpdateAttributeDto,
  ) {
    const attribute = await this.findOne(attributeWhereUniqueInput);

    if (!attribute) {
      throw new NotFoundException("Attribute not found");
    }

    const { categories, ...rest } = updateAttributeDto;

    return this.prisma.attribute.update({
      where: attributeWhereUniqueInput,
      data: {
        ...rest,
        categories: {
          disconnect: attribute.categories?.map(({ id }) => ({ id })),
          connect: categories?.map((value) => ({ id: value })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async delete(attributeWhereUniqueInput: Prisma.AttributeWhereUniqueInput) {
    return this.prisma.attribute.delete({
      where: attributeWhereUniqueInput,
      include: {
        categories: true,
      },
    });
  }
}
