import { SubjectModule } from './modules/subject/subject.module';
import { ClassModule } from './modules/class/class.module';
import { SchoolModule } from './modules/school/school.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('DATABASE_URI'),
          useNewUrlParser: true,
        };
      },

      inject: [ConfigService],
    }),

    EventEmitterModule.forRoot(),
    SubjectModule,
    UserModule,
    AuthModule,
    SchoolModule,
    ClassModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
