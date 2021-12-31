import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from '../../models/user.model';
import { paginateOptions } from 'src/constants';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],

  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          return UserSchema;
        },
      },
    ])
  ]
})
export class UserModule { }
