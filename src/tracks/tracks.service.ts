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

  async updateTracksOrder(
    id_album: string,
    id_user: string,
    id_tracks: string[],
  ) {
    const updates = id_tracks.map((id_track, index) =>
      this.prismaService.tracksOrder.upsert({
        where: {
          id_user_id_album_id_track: {
            id_user,
            id_album,
            id_track,
          },
        },

        update: {
          position: index + 1,
        },
        create: {
          id_album,
          id_user,
          id_track,
          position: index + 1,
        },
      }),
    );

    await Promise.all(updates);
  }

  async findTrackList(id_album: string, id_user: string) {
    const tracks = await this.prismaService.tracksOrder.findMany({
      where: {
        id_album,
        id_user,
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        Track: true,
      },
    });

    return tracks.map((track) => track.Track);
  }

  async resetOrder(id_album: string, id_user: string) {
    await this.prismaService.tracksOrder.deleteMany({
      where: {
        id_album,
        id_user,
      },
    });
  }
}
