import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [AuthModule],
})
export class RatingModule {}
