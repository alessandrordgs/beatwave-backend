import { Module } from '@nestjs/common';
import { LastfmService } from './lastfm.service';
import { LastfmController } from './lastfm.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [LastfmController],
  providers: [LastfmService],
  exports: [LastfmService],
})
export class LastfmModule {}
