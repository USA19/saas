import { SubjectController } from './subject.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubjectService } from './subject.service';
import { SubjectSchema } from 'src/models/subject.model';
import { SchoolModule } from '../school/school.module';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Subject',
        useFactory: () => SubjectSchema
      },
    ]),
    SchoolModule
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule { }
