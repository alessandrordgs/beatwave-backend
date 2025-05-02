import { Module } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import { AlbunsController } from './albuns.controller';
import { LastfmService } from 'src/lastfm/lastfm.service';
import { LastfmModule } from 'src/lastfm/lastfm.module';
import { HttpModule } from '@nestjs/axios';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  controllers: [AlbunsController],
  providers: [AlbunsService, LastfmService],
  imports: [
    LastfmModule,
    HttpModule,
    ArtistsModule,
    TracksModule,
    SpotifyModule,
  ],
})
export class AlbunsModule {}
