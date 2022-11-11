import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { attributes, ...rest } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...rest,
        productAttributes: {
          createMany: {
            data:
              attributes?.map(({ attributeId, value }) => ({
                attributeId,
                value,
              })) || [],
          },
        },
      },
      include: {
        productAttributes: {
          select: {
            value: true,
            attribute: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        productAttributes: {
          select: {
            value: true,
            attribute: true,
          },
        },
      },
    });
  }

  async findOne(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        productAttributes: {
          select: {
            value: true,
            attribute: true,
          },
        },
      },
    });
  }

  async update(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
    updateProductDto: UpdateProductDto,
  ) {
    const { attributes, ...rest } = updateProductDto;

    return this.prisma.product.update({
      where: productWhereUniqueInput,
      data: {
        ...rest,
        productAttributes: {
          deleteMany: {},
          createMany: {
            data:
              attributes?.map(({ attributeId, value }) => ({
                attributeId,
                value,
              })) || [],
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        productAttributes: {
          select: {
            value: true,
            attribute: true,
          },
        },
      },
    });
  }

  async delete(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    return this.prisma.product.delete({
      where: productWhereUniqueInput,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        productAttributes: {
          select: {
            value: true,
            attribute: true,
          },
        },
      },
    });
  }
}
