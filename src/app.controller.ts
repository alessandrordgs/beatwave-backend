import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { ReviewsService } from './reviews/reviews.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reviewsService: ReviewsService,
  ) {}
  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    await this.reviewsService.count();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
