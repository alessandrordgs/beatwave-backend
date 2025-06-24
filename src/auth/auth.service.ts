import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userServices: UsersService,
  ) {}

  login(user: Profile | any) {
    const HOUR_IN_SECONDS = '3600s';
    let email: string | undefined;
    let name: string | undefined;

    if (Array.isArray(user?.emails) && user?.emails.length > 0) {
      email = user.emails[0].value;
      name = user.displayName;
    } else {
      email = user.email;
      name = user.name;
    }

    const payload = {
      name,
      email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: HOUR_IN_SECONDS,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token);
    return await this.userServices.findOneByEmail({
      email: payload?.email,
    });
  }

  async reauthenticate(payload: {
    refresh_token: string;
    access_token: string;
  }) {
    const user = await this.checkRefreshToken(payload);

    return this.login(user);
  }

  private async checkRefreshToken({
    refresh_token,
    access_token,
  }: {
    refresh_token: string;
    access_token: string;
  }) {
    if (!refresh_token) {
      throw new NotFoundException('User not found');
    }

    const payload = <{ email: string }>this.jwtService.decode(access_token);

    const user = await this.userServices.findOneByEmail({
      email: payload.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      this.jwtService.verify(refresh_token);
      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Refresh token is invalid');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }
      throw new UnauthorizedException(error.name);
    }
  }
}
