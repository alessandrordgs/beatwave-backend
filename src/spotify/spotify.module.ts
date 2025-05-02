import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService],
  imports: [HttpModule],
  exports: [SpotifyService],
})
export class SpotifyModule {}
