import { Test } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { CartController } from "./cart.controller";

describe("CartController", () => {
  let cartController: CartController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CartController],
      providers: [PrismaService],
    }).compile();

    cartController = moduleRef.get<CartController>(CartController);
  });

  it("should be defined", () => {
    expect(cartController).toBeDefined();
  });
});
