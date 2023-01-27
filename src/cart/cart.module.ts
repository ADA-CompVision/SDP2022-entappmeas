import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CartController } from "./cart.controller";

@Module({
  controllers: [CartController],
  providers: [PrismaService],
})
export class CartModule {}
