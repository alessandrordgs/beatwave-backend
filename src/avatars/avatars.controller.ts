import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('avatars')
export class AvatarsController {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly storageServices: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    const url = await this.storageServices.uploadFile({
      file,
      isPublic: true,
    });
    return url;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avatarsService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() { photoURL }: UpdateAvatarDto) {
    return this.avatarsService.update({
      where: { id },
      data: { photo_url: photoURL },
    });
  }

  @Delete('avatar/:key')
  async remove(@Param('key') key: string) {
    await this.storageServices.removeFile(key);
  }
}
