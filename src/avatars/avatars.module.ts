import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [AvatarsController],
  providers: [AvatarsService],
  exports: [AvatarsService],
  imports: [StorageModule],
})
export class AvatarsModule {}
