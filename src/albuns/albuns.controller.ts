import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import { CreateAlbunDto } from './dto/create-albun.dto';
import { UpdateAlbunDto } from './dto/update-albun.dto';

@Controller('albuns')
export class AlbunsController {
  constructor(private readonly albunsService: AlbunsService) {}

  @Post()
  create(@Body() createAlbunDto: CreateAlbunDto) {
    return this.albunsService.create(createAlbunDto);
  }

  @Get()
  findAll() {
    return this.albunsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albunsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbunDto: UpdateAlbunDto) {
    return this.albunsService.update(+id, updateAlbunDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albunsService.remove(+id);
  }
}
