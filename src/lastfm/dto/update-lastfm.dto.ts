import { PartialType } from '@nestjs/mapped-types';
import { CreateLastfmDto } from './create-lastfm.dto';

export class UpdateLastfmDto extends PartialType(CreateLastfmDto) {}
