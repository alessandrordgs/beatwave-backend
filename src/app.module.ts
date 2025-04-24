import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AvatarsModule } from './avatars/avatars.module';
import { AlbunsModule } from './albuns/albuns.module';
import { LastfmModule } from './lastfm/lastfm.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AvatarsModule,
    AlbunsModule,
    LastfmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
