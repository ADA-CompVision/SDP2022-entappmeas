import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma.service";
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
          connect: categories?.map((value) => ({ id: value })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async findAll() {
    return this.prisma.attribute.findMany({ include: { categories: true } });
  }

  async findOne(id: number) {
    return this.prisma.attribute.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const { categories, ...rest } = updateAttributeDto;

    return this.prisma.attribute.update({
      where: { id },
      data: {
        ...rest,
        categories: {
          connect: categories?.map((value) => ({ id: value })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.attribute.delete({
      where: { id },
      include: {
        categories: true,
      },
    });
  }
}
