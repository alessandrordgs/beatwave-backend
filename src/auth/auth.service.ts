import { Injectable } from '@nestjs/common';
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

    return this.jwtService.sign(payload);
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token);
    return await this.userServices.findOneByEmail({
      email: payload?.email,
    });
  }
}
