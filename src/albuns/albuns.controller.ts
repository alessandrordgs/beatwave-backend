import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import { LastfmService } from 'src/lastfm/lastfm.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { SpotifyService } from 'src/spotify/spotify.service';

@Controller('albuns')
export class AlbunsController {
  constructor(
    private readonly albunsService: AlbunsService,
    private readonly lastfmService: LastfmService,
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
    private readonly spotifyService: SpotifyService,
  ) {}
  @Get('search')
  async searchAlbum(@Query('album_name') album: string) {
    const albumResponse = await this.spotifyService.searchAlbum(album);
    return albumResponse;
  }

  @Post()
  create(@Body() createAlbunDto: any) {
    return this.albunsService.create(createAlbunDto);
  }

  @Get('info/:id')
  async getAlbumInfo(
    @Query('album') album: string,
    @Query('artist') artist: string,
    @Param('id') id: string,
  ) {
    const albumDB = await this.albunsService.findAlbum({ artist, album });
    const artistDB = await this.artistsService.findOne(artist);

    if (albumDB) {
      const tracksDB = await this.tracksService.findAllByAlbumId(albumDB.id);
      return { album: albumDB, tracks: tracksDB };
    }

    const albumAPI = await this.spotifyService.getAlbumInfo(id);
    let artistId = artistDB?.id;
    if (!artistDB) {
      const artistCreated = await this.artistsService.create({ name: artist });
      artistId = artistCreated.id;
    }

    const albumCreated = await this.albunsService.create({
      tags: albumAPI.tags,
      artists: albumAPI.artists,
      id_spotify: albumAPI.id_spotify,
      cover: albumAPI.cover.photo_url,
      name: albumAPI.name,
      tracks_count: albumAPI.tracks.length,
      release_date: albumAPI.wiki.published,
      Artist: {
        connect: {
          id: artistId,
        },
      },
    });

    const tracks = albumAPI.tracks.map((track) => ({
      artists: track.artists,
      id_spotify: track.id_spotify,
      id_album: albumCreated.id,
      name: track.name,
      duration: track.duration,
      position_original: track.position_original,
    }));

    const tracksCreated = await this.tracksService.create(tracks);
    return {
      album: albumCreated,
      tracks: tracksCreated,
    };
  }
}
