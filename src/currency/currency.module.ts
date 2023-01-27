import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CurrencyController } from "./currency.controller";

@Module({
  controllers: [CurrencyController],
  providers: [PrismaService],
})
export class CurrencyModule {}
