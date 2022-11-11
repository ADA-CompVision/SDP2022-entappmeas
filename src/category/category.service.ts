import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { attributes, ...rest } = createCategoryDto;

    return this.prisma.category.create({
      data: {
        ...rest,
        attributes: {
          connect: attributes?.map((id) => ({ id })),
        },
      },
      include: {
        attributes: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({ include: { attributes: true } });
  }

  async findOne(categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({
      where: categoryWhereUniqueInput,
      include: { attributes: true },
    });
  }

  async update(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.findOne(categoryWhereUniqueInput);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const { attributes, ...rest } = updateCategoryDto;

    return this.prisma.category.update({
      where: categoryWhereUniqueInput,
      data: {
        ...rest,
        attributes: {
          disconnect: category.attributes?.map(({ id }) => ({ id })),
          connect: attributes?.map((value) => ({ id: value })),
        },
      },
    });
  }

  async delete(categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.delete({ where: categoryWhereUniqueInput });
  }
}
