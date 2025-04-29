import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class TracksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.TracksCreateManyInput[]) {
    return await this.prismaService.tracks.createManyAndReturn({
      data: data,
      skipDuplicates: true,
    });
  }

  async findAllByAlbumId(id_album: string) {
    return await this.prismaService.tracks.findMany({
      where: {
        id_album: id_album,
      },
    });
  }
}
