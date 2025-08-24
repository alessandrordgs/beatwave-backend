import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Profile } from 'passport-spotify';
import { AuthService } from './auth.service';
import { SpotifyOauthGuard } from './guard/spotify-oauth.guard';
import { UsersService } from 'src/users/users.service';
import { AvatarsService } from 'src/avatars/avatars.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { loginAuthDto } from './dto/login-auth.dto';
interface Photos {
  value: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userServices: UsersService,
    private readonly avatarsServices: AvatarsService,
  ) {}

  @UseGuards(SpotifyOauthGuard)
  @Get('/spotify/login')
  loginWithSpotify(): void {
    return;
  }

  @UseGuards(SpotifyOauthGuard)
  @Get('redirect')
  async spotifyAuthRedirect(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response> {
    const {
      user,
      authInfo,
    }: {
      user: Profile;
      authInfo: {
        accessToken: string;
        refreshToken: string;
        expires_in: number;
      };
    } = req;

    if (!user) {
      res.redirect('/');
      return;
    }

    req.user = undefined;
    const jwt = this.authService.login(user);
    const HAS_USER = await this.userServices.findOneByEmail({
      email: user.emails[0].value,
    });

    if (!HAS_USER) {
      const USER_CREATED = await this.userServices.create({
        email: user.emails[0].value,
        name: user.displayName,
        auth_id: user.id,
      });

      await this.avatarsServices.create({
        photo_url: (user.photos[0] as Partial<Photos> as Photos).value,
        user: {
          connect: {
            id: USER_CREATED.id,
          },
        },
      });
    }
    res.set('authorization', `Bearer ${jwt}`);
    res.set('access_token', authInfo.accessToken);
    res.redirect(`${process.env.URL_FRONTEND}?code=${jwt.access_token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findOneByEmail(@Headers('authorization') token: string) {
    if (token) {
      const user = await this.authService.getUserFromAuthenticationToken(
        token.replace('Bearer ', ''),
      );
      const { access_token, refresh_token } = this.authService.login(user);
      return {
        user: user,
        access_token: access_token,
        refresh_token: refresh_token,
      };
    }
  }

  @Post('/login')
  async login(@Body() loginDto: loginAuthDto) {
    const user = await this.userServices.findOneByEmail({
      email: loginDto.email,
    });

    if (!user) {
      const USER_CREATED = await this.userServices.create({
        email: loginDto.email,
        name: loginDto.name,
        auth_id: loginDto.auth_id,
        avatars: {
          create: {
            photo_url: loginDto.avatar.photo_url,
          },
        },
      });

      const jwt = this.authService.login(USER_CREATED);

      return {
        access_token: jwt,
        refresh_token: jwt.refresh_token,
        user: USER_CREATED,
      };
    }
    const { access_token, refresh_token } = this.authService.login(user);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: user,
    };
  }
  @Post('/refresh')
  async reauthenticate(
    @Headers('authorization') token: string,
    @Body() body: { refresh_token: string },
  ) {
    return this.authService.reauthenticate({
      access_token: token.replace('Bearer ', ''),
      refresh_token: body.refresh_token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout() {}
}
