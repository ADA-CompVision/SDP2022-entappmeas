import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AttributeModule } from "./attribute/attribute.module";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PrismaService } from "./prisma/prisma.service";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      exclude: ["/api*"],
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    AttributeModule,
    ProductModule,
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
