import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Headers('authorization') token: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      token.replace('Bearer ', ''),
    );
    const review = await this.reviewsService.create({
      review: createReviewDto.review,
      listen_at: createReviewDto.listen_at,
      User: {
        connect: {
          id: user.id,
        },
      },
      Album: {
        connect: {
          id: createReviewDto.id_album,
        },
      },
    });

    return review;
  }
  @Get(':id_album')
  findAll(@Param('id_album') id_album: string) {
    return this.reviewsService.findAll(id_album);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
