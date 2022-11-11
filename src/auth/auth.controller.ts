import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Public } from "src/decorators/public.decorator";
import { LocalAuthGuard } from "src/guards/local-auth.guard";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get("account")
  async getAccount(@Request() req) {
    return req.user;
  }
}
