// src/spotify/spotify.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';
import * as Buffer from 'buffer';
import { HttpService } from '@nestjs/axios';
import {
  SpotifyAlbum,
  SpotifyAlbumSearchResponse,
} from './interfaces/ISpotifyAlbumResponse';
import { IAlbumSearchResultsResponse } from 'src/albuns/Interfaces/IAlbumSearchResponse';
import { IAlbum } from 'src/albuns/Interfaces/IAlbum';
@Injectable()
export class SpotifyService {
  private accessToken: string;
  private tokenExpiresAt: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async authenticate(): Promise<void> {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authBuffer = Buffer.Buffer.from(
      `${clientId}:${clientSecret}`,
    ).toString('base64');

    const headers = {
      Authorization: `Basic ${authBuffer}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const data = qs.stringify({ grant_type: 'client_credentials' });

    const response = await firstValueFrom(
      this.httpService.post('https://accounts.spotify.com/api/token', data, {
        headers,
      }),
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
  }

  async getAccessToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
      await this.authenticate();
    }
    return this.accessToken;
  }

  async searchAlbum(name: string): Promise<any> {
    const token = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await firstValueFrom(
      this.httpService.get<SpotifyAlbumSearchResponse>(
        `https://api.spotify.com/v1/search`,
        {
          headers,
          params: {
            q: name,
            type: 'album',
            limit: 50,
          },
        },
      ),
    );
    const data: IAlbumSearchResultsResponse = {
      meta: {
        search_term: name,
        start_page: 1,
        items_per_page: response.data.albums.limit,
        start_index: response.data.albums.offset,
      },
      albuns: response.data.albums.items.map((album) => ({
        id_spotify: album.id,
        name: album.name,
        cover: album.images.find((image) => image.width === 640)?.url || '',
        artist: album.artists[0].name,
      })),
    };
    return data;
  }

  async getAlbumInfo(id: string) {
    const token = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await firstValueFrom(
      this.httpService.get<SpotifyAlbum>(
        `https://api.spotify.com/v1/albums/${id}`,
        {
          headers,
        },
      ),
    );

    const data: IAlbum = {
      id_spotify: response.data.id,
      artist: response.data.artists[0].name,
      artists: response.data.artists.map((artist) => artist.name),
      tags: response.data.genres,
      name: response.data.name,
      cover: {
        photo_url:
          response.data.images.find((img) => img.height === 300)?.url || '',

        size: 'medium',
      },
      tracks: response.data.tracks.items.map((track) => ({
        name: track.name,
        duration: track.duration_ms,
        position_original: track.track_number,
        url: track.external_urls.spotify,
        id_spotify: track.id,
        artists: track.artists.map((artist) => artist.name),
      })),
      wiki: {
        published: response.data.release_date,
        summary: `Álbum lançado em ${response.data.release_date} pela gravadora ${response.data.label}.`,
      },
    };

    return data;
  }
}
