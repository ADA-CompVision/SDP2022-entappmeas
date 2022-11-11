import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserWithoutPassword } from "src/types/user.type";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { compare } from "src/utils/bcrypt.util";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({ username });

    if (user && compare(password, user.password)) {
      const { password, ...res } = user;

      return res;
    }

    return null;
  }

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(user: UserWithoutPassword) {
    return {
      user,
      accessToken: this.jwtService.sign(user),
    };
  }
}
