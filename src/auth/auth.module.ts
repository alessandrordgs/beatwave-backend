import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SpotifyOauthStrategy } from './strategies/spotify-oauth.strategy';
import { UsersService } from 'src/users/users.service';
import { AvatarsService } from 'src/avatars/avatars.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '3600s',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    SpotifyOauthStrategy,
    UsersService,
    AvatarsService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
