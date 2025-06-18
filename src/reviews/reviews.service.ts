import { Injectable } from '@nestjs/common';
// import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ReviewsService {
  constructor(private prismaService: PrismaService) {}
  async create(data: Prisma.ReviewsCreateInput) {
    return await this.prismaService.reviews.create({ data });
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
