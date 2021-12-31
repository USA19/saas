import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateClassDto, UpdateClassDto } from 'src/dtos';
import { Class, PaginationOptionType } from 'src/interfaces';
import { SchoolService } from '../school/school.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel('Class')
    private readonly classModel: Model<Class>,
    public readonly schoolService: SchoolService,
  ) { }

  async findAllClassesOfSchool(schoolId: string, paginationOptionType: PaginationOptionType): Promise<Class[]> {
    try {
      const { page, limit } = paginationOptionType;
      const skip = (page - 1) * limit
      return await this.classModel.find({ schoolId }).populate('teachers').skip(skip).limit(limit).sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(_id: string): Promise<Class> {
    try {
      return await this.classModel.findById(_id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(query: any): Promise<Class> {
    try {
      return await this.classModel.findOne(query).populate('teachers');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createClassOfSchool(createClassDto: CreateClassDto): Promise<Class> {
    try {
      const { schoolId, name } = createClassDto;
      const condition = { $and: [{ schoolId }, { name: name.toLowerCase() }] }
      const classExist = await this.findOne(condition)
      if (classExist) {
        throw new BadRequestException("Class Already Exist")
      }

      return await this.classModel.create(createClassDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateClassOfSchool(_id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    try {
      const updatedClass = await this.classModel.findByIdAndUpdate(_id, updateClassDto, { new: true }).populate('teachers');
      if (!updatedClass) {
        throw new BadRequestException("Class Not Found");
      }

      return updatedClass;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteClass(_id: string): Promise<Class> {
    try {
      const deletedClass = await this.classModel.findByIdAndDelete(_id);
      if (!deletedClass) {
        throw new BadRequestException("Class not fount");
      }

      return deletedClass;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
