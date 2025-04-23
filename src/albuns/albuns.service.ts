import { Injectable } from '@nestjs/common';
import { CreateAlbunDto } from './dto/create-albun.dto';
import { UpdateAlbunDto } from './dto/update-albun.dto';

@Injectable()
export class AlbunsService {
  create(createAlbunDto: CreateAlbunDto) {
    return 'This action adds a new albun';
  }

  findAll() {
    return `This action returns all albuns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} albun`;
  }

  update(id: number, updateAlbunDto: UpdateAlbunDto) {
    return `This action updates a #${id} albun`;
  }

  remove(id: number) {
    return `This action removes a #${id} albun`;
  }
}
