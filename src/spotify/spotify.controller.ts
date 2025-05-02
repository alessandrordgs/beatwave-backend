// src/spotify/spotify.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('search')
  async searchArtist(@Query('artist') artist: string) {
    if (!artist) {
      return { message: 'O parâmetro "artist" é obrigatório.' };
    }

    const result = await this.spotifyService.searchAlbum(artist);
    return result;
  }
}
