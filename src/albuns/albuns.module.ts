import { Module } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import { AlbunsController } from './albuns.controller';

@Module({
  controllers: [AlbunsController],
  providers: [AlbunsService],
})
export class AlbunsModule {}
