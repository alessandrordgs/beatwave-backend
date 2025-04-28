import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import { LastfmService } from 'src/lastfm/lastfm.service';
import { ArtistsService } from 'src/artists/artists.service';

@Controller('albuns')
export class AlbunsController {
  constructor(
    private readonly albunsService: AlbunsService,
    private readonly lastfmService: LastfmService,
    private readonly artistsService: ArtistsService,
  ) {}
  @Get('search')
  async searchAlbum(@Query('album_name') album: string) {
    const albumResponse = await this.lastfmService.searchAlbuns(album);
    return albumResponse;
  }

  @Post()
  create(@Body() createAlbunDto: any, artist_id: string) {
    return this.albunsService.create(createAlbunDto, artist_id);
  }

  @Get('info')
  async getAlbumInfo(
    @Query('album') album: string,
    @Query('artist') artist: string,
  ) {
    const albumDB = await this.albunsService.findAlbum({ artist, album });
    const artistDB = await this.artistsService.findOne(artist);

    if (albumDB) {
      return { album: albumDB };
    }

    let artistId = artistDB?.id;
    if (!artistDB) {
      const artistCreated = await this.artistsService.create({ name: artist });
      artistId = artistCreated.id;
    }

    const albumAPI = await this.lastfmService.getAlbumInfo({ album, artist });

    const albumCreated = await this.albunsService.create(
      {
        cover: albumAPI.cover.photo_url,
        name: albumAPI.name,
        tracks_count: albumAPI.tracks.length,
      },
      artistId,
    );

    return {
      album: albumCreated,
    };
  }
}
