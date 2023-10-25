import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  create(@Body() { photoURL, userId }: CreateAvatarDto) {
    return this.avatarsService.create({
      photo_url: photoURL,
      user: {
        connect: { id: userId },
      },
    });
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
}
