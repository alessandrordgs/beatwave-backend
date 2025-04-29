import { Injectable } from '@nestjs/common';
import { generateApiSignature } from './lastfm.utils';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'node_modules/axios';
import { IAlbumResponse } from './interfaces/IAlbumResponse';
import { IAlbum } from 'src/albuns/Interfaces/IAlbum';
import {
  IAlbumSearchResponse,
  IAlbumSearchResultsResponse,
} from 'src/albuns/Interfaces/IAlbumSearchResponse';
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
      this.httpService.get<IAlbumSearchResponse>(
        'https://ws.audioscrobbler.com/2.0/',
        {
          params: {
            ...params,
            format: 'json',
          },
        },
      ),
    );
    const data: IAlbumSearchResultsResponse = {
      meta: {
        search_term: response.data.results['opensearch:Query'].searchTerms,
        start_page: response.data.results['opensearch:Query'].startPage,
        items_per_page: response.data.results['opensearch:itemsPerPage'],
        start_index: response.data.results['opensearch:startIndex'],
      },
      albuns: response.data.results.albummatches.album.map((album) => ({
        name: album.name,
        cover: album.image.find((item) => item.size === 'large')['#text'],
        artist: album.artist,
      })),
    };
    return data;
  }

  async getAlbumInfo({ album, artist }: { album: string; artist: string }) {
    try {
      const params = {
        album,
        artist,
        method: 'album.getinfo',
        api_key: API_KEY,
        lang: 'pt',
        autocorrect: 1,
      };
      const response = await firstValueFrom(
        this.httpService.get<IAlbumResponse>(
          'https://ws.audioscrobbler.com/2.0/',
          {
            params: {
              ...params,
              format: 'json',
            },
          },
        ),
      );
      console.log('data', {
        artist: response.data.album.artist,
        tags: response.data.album.tags.tag,
        name: response.data.album.name,
        cover: {
          photo_url: response.data.album.image.find(
            (item) => item.size === 'large',
          )?.['#text'],
          size: response.data.album.image.find((item) => item.size === 'large')
            ?.size,
        },
        tracks: response.data.album.tracks.track.map((track) => ({
          name: track.name,
          duration: track.duration,
          position_original: track['@attr'].rank,
          url: track.url,
        })),
        wiki: {
          published: response.data?.album?.wiki?.published,
          summary: response.data?.album?.wiki?.summary,
        },
      });
      const data: IAlbum = {
        artist: response.data.album.artist,
        tags: response.data.album.tags.tag,
        name: response.data.album.name,
        cover: {
          photo_url: response.data.album.image.find(
            (item) => item.size === 'large',
          )?.['#text'],
          size: response.data.album.image.find((item) => item.size === 'large')
            ?.size,
        },
        tracks: response.data.album.tracks.track.map((track) => ({
          name: track.name,
          duration: track.duration,
          position_original: track['@attr'].rank,
          url: track.url,
        })),
        wiki: {
          published: response.data?.album?.wiki?.published,
          summary: response.data?.album?.wiki?.summary,
        },
      };

      console.log('data', data);
      return data;
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        throw new Error('AlbumNotFound');
      }
    }
  }
}
