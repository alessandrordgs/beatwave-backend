import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
      include: {
        avatars: true,
      },
    });
  }

  findOneByEmail({ email }: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        avatars: true,
      },
    });
  }

  findOne({ id }: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }
}
