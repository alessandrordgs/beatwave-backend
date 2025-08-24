import { Injectable } from '@nestjs/common';
// import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
@Injectable()
export class ReviewsService {
  constructor(private prismaService: PrismaService) {}

  async count() {
    return await this.prismaService.reviews.count();
  }
  async create(createReviewDto: CreateReviewDto, id_user: string) {
    const review = await this.prismaService.reviews.create({
      data: {
        review: createReviewDto.review,
        listen_at: createReviewDto.listen_at,
        User: {
          connect: {
            id: id_user,
          },
        },
        Album: {
          connect: {
            id: createReviewDto.id_album,
          },
        },
      },
    });

    if (createReviewDto.rating) {
      await this.prismaService.ratings.create({
        data: {
          rating: createReviewDto.rating,
          User: {
            connect: {
              id: id_user,
            },
          },
          Album: {
            connect: {
              id: createReviewDto.id_album,
            },
          },
          Review: {
            connect: {
              id: review.id,
            },
          },
        },
      });
    }
    return review;
  }

  async findAll(id_album: string) {
    return await this.prismaService.reviews.findMany({
      where: {
        id_album: id_album,
      },
      omit: {
        id_album: true,
        id_user: true,
        updated_at: true,
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
        Ratings: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string, id_user: string) {
    return this.prismaService.reviews.findFirst({
      where: {
        id: id,
        id_user: id_user,
      },
    });
  }

  async findLastReviewByUser(id_user: string) {
    return this.prismaService.reviews.findFirst({
      where: {
        id_user: id_user,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: string, id_user: string, data: UpdateReviewDto) {
    return await this.prismaService.reviews.update({
      data,
      where: {
        id: id,
        id_user: id_user,
      },
    });
  }

  async remove(id: string, id_user) {
    return await this.prismaService.reviews.delete({
      where: {
        id: id,
        id_user: id_user,
      },
    });
  }
}
