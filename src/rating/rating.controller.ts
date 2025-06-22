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
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('rating')
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Headers('authorization') token: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      token.replace('Bearer ', ''),
    );
    return this.ratingService.create(createRatingDto, user.id);
  }

  // @Get()
  // findAll() {
  //   return this.ratingService.findAll();
  // }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Headers('authorization') token: string,
    @Param('id') id: string,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      token.replace('Bearer ', ''),
    );
    return this.ratingService.findOne(user.id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingService.remove(+id);
  }
}
