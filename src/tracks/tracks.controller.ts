import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { UpdateTracksOrderDto } from './dto/updateOrder.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Put('reorder/:id_album')
  async updateOrder(
    @Headers('authorization') token: string,
    @Param('id_album') id_album: string,
    @Body() updateTracksOrderDto: UpdateTracksOrderDto,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      token.replace('Bearer ', ''),
    );
    return await this.tracksService.updateTracksOrder(
      id_album,
      user.id,
      updateTracksOrderDto.id_tracks,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('order/:id_album')
  async findTracklist(
    @Headers('authorization') token: string,
    @Param('id_album') id_album: string,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      token.replace('Bearer ', ''),
    );
    return await this.tracksService.findTrackList(id_album, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('order/:id_album')
  async resetOrder(
    @Headers('authorization') token: string,
    @Param('id_album') id_album: string,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      token.replace('Bearer ', ''),
    );
    return await this.tracksService.resetOrder(id_album, user.id);
  }
}
