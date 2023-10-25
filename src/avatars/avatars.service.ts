import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AvatarsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.AvatarsCreateInput) {
    return this.prismaService.avatars.create({ data });
  }

  findOne({ id }: Prisma.AvatarsWhereUniqueInput) {
    return this.prismaService.avatars.findUnique({ where: { id } });
  }

  update(params: {
    where: Prisma.AvatarsWhereUniqueInput;
    data: Prisma.AvatarsUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.avatars.update({
      data,
      where,
    });
  }
}
