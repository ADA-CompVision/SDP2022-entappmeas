import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AttributeModule } from "./attribute/attribute.module";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { CategoryModule } from "./category/category.module";
import { CurrencyModule } from "./currency/currency.module";
import { DiscountModule } from "./discount/discount.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PrismaService } from "./prisma/prisma.service";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CategoryModule,
    AttributeModule,
    ProductModule,
    CurrencyModule,
    CartModule,
    DiscountModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    PrismaService,
  ],
})
export class AppModule {}
