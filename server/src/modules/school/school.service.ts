import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSchoolDto, UpdateSchoolDto } from 'src/dtos';

import { FindUsersOfSomeRoleOfSchoolInputType, GetAllSchoolsResponse, PaginationOptionType, School } from 'src/interfaces';
import { UserService } from '../user/user.service';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel('School')
    private readonly schoolModel: Model<School>,
    private readonly userService: UserService,
  ) { }

  async findAll(paginationOptionType: PaginationOptionType): Promise<GetAllSchoolsResponse> {
    try {
      const { page, limit } = paginationOptionType;
      const skip = (page - 1) * limit
      const schools = await this.schoolModel.find().populate('principle').populate('teachers').skip(skip).limit(limit).sort({ createdAt: -1 });
      const count = await this.schoolModel.countDocuments();
      return { schools, count }

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(_id: string): Promise<School> {
    try {
      return await this.schoolModel.findById(_id).populate('principle').populate('teachers');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(query: any): Promise<School> {
    try {
      const school = await this.schoolModel.findOne(query);
      if (!school) {
        throw new BadRequestException("No school exist with this id")
      }

      return school;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createSchool(createShoolInputType: CreateSchoolDto): Promise<School> {
    try {
      return await this.schoolModel.create(createShoolInputType)
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateSchool(_id: string, updateShoolInputType: UpdateSchoolDto): Promise<School> {
    try {
      const school = await this.schoolModel.findByIdAndUpdate(_id, updateShoolInputType, { new: true });

      if (!school) {
        throw new BadRequestException("No school exist with this id")
      }

      return school;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteSchool(_id: string): Promise<string> {
    try {
      await this.schoolModel.deleteOne({ _id })
      return "school deleted successfully"
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllStudentsOfSchool(findUsersOfSchoolInput: FindUsersOfSomeRoleOfSchoolInputType) {
    return await this.userService.findUsersOfSomeRoleOfSchool(findUsersOfSchoolInput)
  }
}
