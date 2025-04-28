import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlbunsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Prisma.AlbunsCreateInput, artist_id: string) {
    return await this.prismaService.albuns.create({
      data: {
        ...data,
        Artist: {
          connect: {
            id: artist_id,
          },
        },
      },
      include: {
        Artist: true,
      },
    });
  }

  async findAlbum({ album, artist }: { album: string; artist: string }) {
    return await this.prismaService.albuns.findFirst({
      where: {
        name: {
          equals: album,
          mode: 'insensitive',
        },
        Artist: {
          name: {
            equals: artist,
            mode: 'insensitive',
          },
        },
      },
      include: {
        Artist: true,
      },
    });
  }
}
