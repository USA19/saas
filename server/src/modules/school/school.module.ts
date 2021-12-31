import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SchoolSchema } from 'src/models/school.model';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'School',
        useFactory: () => {
          return SchoolSchema;
        },
      },
    ]),
    UserModule
  ],

  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService]
})

export class SchoolModule { }
