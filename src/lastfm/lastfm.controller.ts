import { Controller, Get, Res, Query } from '@nestjs/common';
import { LastfmService } from './lastfm.service';
import { Response } from 'express';

@Controller('lastfm')
export class LastfmController {
  constructor(private readonly lastfmService: LastfmService) {}

  @Get('login')
  login(@Res() res: Response) {
    const url = this.lastfmService.getLastFmLoginUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('token') token: string) {
    const sessionKey = await this.lastfmService.getSessionKey(token);
    return sessionKey;
  }

  @Get('albuns')
  async searchAlbum(@Query('album_name') album: string) {
    const albumResponse = await this.lastfmService.searchAlbuns(album);
    return albumResponse;
  }
}
