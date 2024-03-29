import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto";

@ApiTags("Business")
@Controller("business")
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post("register")
  async register(@Body() createBusinessDto: CreateBusinessDto) {
    const business = await this.businessService.register(createBusinessDto);
    this.authService.sendConfirmationEmail(business.id);

    return business;
  }
}
