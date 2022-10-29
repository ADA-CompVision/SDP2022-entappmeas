import { Module } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
