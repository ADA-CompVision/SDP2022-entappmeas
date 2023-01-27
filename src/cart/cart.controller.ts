import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Currency, DiscountType, Role } from "@prisma/client";
import { Roles } from "src/decorators/roles.decorator";
import { RoleGuard } from "src/guards/role.guard";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";
import { CartDto } from "./dto/CartDto";

const stripe = new Stripe(
  "sk_test_51MIdcaFDm83hh989c1RyCXyQrnWN6FbShtk95LerPXNqEwOXX8Ja8jt5QDlDQnI7dNj1Xmi335EXRHWCSV8EeFEo00et16hvsP",
  { apiVersion: "2022-11-15" },
);

@ApiTags("Cart")
@ApiBearerAuth()
@Controller("cart")
export class CartController {
  constructor(private readonly prismaService: PrismaService) {}

  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @Get()
  async getCart(@Request() req) {
    return this.prismaService.cart.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        count: true,
        product: {
          select: {
            id: true,
            category: true,
            name: true,
            description: true,
            prices: {
              select: {
                id: true,
                value: true,
                startDate: true,
                endDate: true,
                currency: true,
              },
            },
          },
        },
      },
    });
  }

  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @Post()
  async add(@Request() req, @Body() cartDto: CartDto) {
    const { products } = cartDto;

    await this.prismaService.cart.deleteMany({
      where: { userId: req.user.id },
    });

    return this.prismaService.cart.createMany({
      data: products.map(({ productId, count }) => ({
        userId: req.user.id,
        productId,
        count,
      })),
    });
  }

  async applyDiscount(total: number, discountCode: string) {
    const now = new Date();
    let discountTotal = total;

    const discount = discountCode
      ? await this.prismaService.discount.findUnique({
          where: { code: discountCode },
        })
      : null;

    if (!discount) {
      return total;
    }

    if (discount.remaining === 0) {
      return total;
    }

    if (
      !discount.endDate ||
      (discount.startDate < now && discount.endDate > now)
    ) {
      switch (discount.type) {
        case DiscountType.PERCENTAGE_TOTAL:
          discountTotal =
            discountTotal - (discountTotal * discount.value) / 100;
          break;
        case DiscountType.FIXED_TOTAL:
          discountTotal -= discount.value;
          break;
        default:
          break;
      }

      if (discount.limit) {
        await this.prismaService.discount.update({
          data: {
            remaining: {
              decrement: 1,
            },
          },
          where: { code: discountCode },
        });
      }
    }

    return discountTotal;
  }

  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @Get("total")
  @ApiQuery({ name: "discountCode", required: false })
  async getTotal(@Request() req, @Query("discountCode") discountCode: string) {
    const now = new Date();

    const cart = await this.prismaService.cart.findMany({
      where: { userId: req.user.id },
      orderBy: [{ count: "desc" }],
      select: {
        id: true,
        count: true,
        product: {
          select: {
            id: true,
            category: true,
            name: true,
            description: true,
            prices: {
              select: {
                id: true,
                value: true,
                startDate: true,
                endDate: true,
                currency: true,
              },
            },
          },
        },
      },
    });

    let total = 0;
    let currency: Currency = null;

    cart.forEach((item) => {
      const price = item.product.prices.find(
        (_price) =>
          !_price.endDate || (_price.startDate < now && _price.endDate > now),
      );

      total += item.count * price.value;
      currency = price.currency;
    });

    const discountTotal = await this.applyDiscount(total, discountCode);

    return {
      cart,
      currency,
      total,
      discountTotal,
    };
  }

  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @Get("checkout")
  async checkout(@Request() req) {
    const now = new Date();

    const cart = await this.prismaService.cart.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        count: true,
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            prices: {
              select: {
                id: true,
                value: true,
                startDate: true,
                endDate: true,
                currency: true,
              },
            },
          },
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cart.forEach((item) => {
      const price = item.product.prices.find(
        (_price) =>
          !_price.endDate || (_price.startDate < now && _price.endDate > now),
      );

      line_items.push({
        price_data: {
          currency: price.currency.acronym.toLowerCase(),
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
          unit_amount: price.value * 100,
        },
        quantity: item.count,
      });
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url:
        "https://sdp2022-app.vercel.app/order/success/{CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://sdp2022-app.vercel.app/order/error/{CHECKOUT_SESSION_ID}",
    });

    return session.url;
  }
}