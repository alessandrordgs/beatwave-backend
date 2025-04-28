import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ArtistsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ArtistsCreateInput) {
    return await this.prismaService.artists.create({
      data,
    });
  }

  async findOne(artist_name: string) {
    return await this.prismaService.artists.findFirst({
      where: {
        name: artist_name,
      },
    });
  }
}
