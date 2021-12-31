import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClassSchema } from 'src/models/class.model';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { SchoolModule } from "../school/school.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Class',
        useFactory: () => {
          return ClassSchema;
        },
      },
    ]),

    SchoolModule
  ],

  controllers: [ClassController],
  providers: [ClassService,],
})

export class ClassModule { }
