import { Module } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import { AlbunsController } from './albuns.controller';
import { LastfmService } from 'src/lastfm/lastfm.service';
import { LastfmModule } from 'src/lastfm/lastfm.module';
import { HttpModule } from '@nestjs/axios';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  controllers: [AlbunsController],
  providers: [AlbunsService, LastfmService],
  imports: [LastfmModule, HttpModule, ArtistsModule],
})
export class AlbunsModule {}
