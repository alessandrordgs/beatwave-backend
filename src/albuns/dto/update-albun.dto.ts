import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbunDto } from './create-albun.dto';

export class UpdateAlbunDto extends PartialType(CreateAlbunDto) {}
