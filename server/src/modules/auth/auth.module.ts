import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { UserSchema } from 'src/models/user.model';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    RedisModule,
    PassportModule.register({ defaultStrategy: "jwt" }),

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRY") },
      }),

      inject: [ConfigService],
    }),

    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          return UserSchema;
        },
      },
    ])
  ],

  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, ConfigService, LocalStrategy],
  exports: [AuthService, PassportModule]
})

export class AuthModule { }
