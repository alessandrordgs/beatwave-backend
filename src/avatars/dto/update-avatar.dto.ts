import { PartialType } from '@nestjs/mapped-types';
import { CreateAvatarDto } from './create-avatar.dto';

export class UpdateAvatarDto extends PartialType(CreateAvatarDto) {
  updated_at: string;
}
