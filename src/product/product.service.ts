import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma.service";
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
        ProductAttribute: {
          createMany: {
            data: attributes?.map(({ id, value }) => ({
              attributeId: id,
              value,
            })),
          },
        },
      },
      include: {
        ProductAttribute: {
          include: {
            attribute: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        ProductAttribute: {
          include: {
            attribute: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        ProductAttribute: {
          include: {
            attribute: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { attributes, ...rest } = updateProductDto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ProductAttribute: {
          connect: attributes?.map(({ id }) => ({
            id,
          })),
        },
      },
      include: {
        ProductAttribute: {
          include: {
            attribute: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  delete(id: number) {
    return this.prisma.product.delete({
      where: { id },
      include: {
        ProductAttribute: {
          include: {
            attribute: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
