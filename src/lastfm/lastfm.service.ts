import { Injectable } from '@nestjs/common';
import { generateApiSignature } from './lastfm.utils';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
const API_KEY = process.env.LASTFM_API_KEY;
const API_SECRET = process.env.LASTFM_API_SECRET;
const CALLBACK_URL = process.env.LASTFM_CALLBACK_URL;

@Injectable()
export class LastfmService {
  constructor(private readonly httpService: HttpService) {}
  getLastFmLoginUrl(): string {
    return `https://www.last.fm/api/auth/?api_key=${API_KEY}&cb=${CALLBACK_URL}`;
  }

  async getSessionKey(token: string): Promise<string> {
    const method = 'auth.getSession';
    const params = {
      api_key: API_KEY,
      method,
      token,
    };

    const api_sign = generateApiSignature(params, API_SECRET);

    const response = await firstValueFrom(
      this.httpService.get('https://ws.audioscrobbler.com/2.0/', {
        params: {
          ...params,
          api_sig: api_sign,
          format: 'json',
        },
      }),
    );

    console.log(response.data?.session?.key);
    return response.data?.session?.key;
  }

  async searchAlbuns(name: string) {
    const params = {
      api_key: API_KEY,
      album: name,
      method: 'album.search',
    };
    const response = await firstValueFrom(
      this.httpService.get('https://ws.audioscrobbler.com/2.0/', {
        params: {
          ...params,
          format: 'json',
        },
      }),
    );
    return response.data;
  }
}
