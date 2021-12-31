import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubjectInputDto, UpdateSubjectInputDto } from 'src/dtos';
import { PaginationOptionType, Subject } from 'src/interfaces';
import { SchoolService } from '../school/school.service';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel('Subject')
    private readonly subjectModel: Model<Subject>,
    public readonly schoolService: SchoolService,
  ) { }

  async findAllSubjectsOfClassesOfSchool(classId: string, paginationOptionType: PaginationOptionType): Promise<Subject[]> {
    try {
      const { page, limit } = paginationOptionType;
      const skip = (page - 1) * limit
      return await this.subjectModel.find({ classId }).skip(skip).limit(limit).sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(_id: string): Promise<Subject> {
    try {
      return await this.subjectModel.findById(_id).populate("teacher").populate("schoolId").populate("classId");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(query: any): Promise<Subject> {
    try {
      return await this.subjectModel.findOne(query).populate("teacher").populate("schoolId").populate("classId");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createSubjectOfClass(createClassDto: CreateSubjectInputDto): Promise<Subject> {
    try {
      const { schoolId, name, classId } = createClassDto;
      const condition = { $and: [{ schoolId }, { classId }, { name: name.toLowerCase() }] }
      const classExist = await this.findOne(condition)
      if (classExist) {
        throw new BadRequestException("Class Already Exist")
      }

      return await this.subjectModel.create(createClassDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateSubjectOfClass(_id: string, updateSubjectDto: UpdateSubjectInputDto): Promise<Subject> {
    try {
      return await this.subjectModel.findByIdAndUpdate(_id, updateSubjectDto, { new: true }).populate("teacher").populate("schoolId").populate("classId");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
