import { Injectable } from '@nestjs/common';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateRatingDto, id_user: string) {
    const reviewConnect = data.id_review
      ? { Review: { connect: { id: data.id_review } } }
      : {};

    const rating = await this.prismaService.ratings.create({
      data: {
        rating: data.rating, //lov u ma baby k!
        User: {
          connect: {
            id: id_user,
          },
        },
        Album: {
          connect: {
            id: data.id_album,
          },
        },
        ...reviewConnect, // Conecta o review apenas se id_review estiver presente
      },
    });

    await this.prismaService.reviews.create({
      data: {
        listen_at: new Date(),
        review: '',
        Album: {
          connect: {
            id: rating.id_album,
          },
        },
        User: {
          connect: {
            id: id_user,
          },
        },
        Ratings: {
          connect: {
            id: rating.id,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all rating`;
  }

  async findOne(user_id: string, id_album) {
    return await this.prismaService.ratings.findFirst({
      where: {
        id_user: user_id,
        id_album: id_album,
      },
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
