import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { hash } from "src/utils/bcrypt.util";
import { PrismaService } from "src/utils/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  async create(createUserDto: CreateUserDto) {
    const password = hash(createUserDto.password);

    return this.prisma.user.create({ data: { ...createUserDto, password } });
  }
}
