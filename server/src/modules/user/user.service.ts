import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateUserDto, UserRegisterDto } from 'src/dtos';
import { FindUsersOfSchoolInputType, FindUsersOfSomeRoleOfSchoolInputType, GetAllUsersResponse, PaginationOptionType, User } from 'src/interfaces';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) { }

  /**
   * Finds all
   * @param paginationOptionType 
   * @returns all 
   */
  async findAll(paginationOptionType: PaginationOptionType): Promise<GetAllUsersResponse> {
    try {
      const { page, limit } = paginationOptionType;
      const skip = (page - 1) * limit;
      const users = await this.userModel.find().populate("schoolId").skip(skip).limit(limit).sort({ createdAt: -1 });
      const count = await this.userModel.countDocuments();
      return { users, count }
    }

    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(query): Promise<User | null> {
    try {
      return await this.userModel.findOne(query);
    }

    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(_id: string): Promise<User | null> {
    try {
      return await this.userModel.findById({ _id });
    }

    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(user: UserRegisterDto): Promise<User> {
    try {
      return await this.userModel.create(user);
    }

    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUser(_id: string, updateUserInputType: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(_id, updateUserInputType, { new: true });
      if (!user) {
        throw new BadRequestException("no user found");
      }

      return user;
    }

    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(_id: string): Promise<string> {
    try {
      const user = this.findById(_id);
      if (!user) {
        new BadRequestException('User not found');
      }

      await this.userModel.deleteOne({ _id });
      return "user deleted successfully"
    }

    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUsersOfSomeRoleOfSchool(findUsersOfSchoolInput: FindUsersOfSomeRoleOfSchoolInputType): Promise<GetAllUsersResponse> {
    try {
      const { page, limit, schoolId, role } = findUsersOfSchoolInput;
      const skip = (page - 1) * limit;
      const users = await this.userModel.find({
        $and: [{ schoolId }, { role }]
      }).skip(skip).limit(limit).sort({ createdAt: -1 });

      const count = await this.userModel.countDocuments({
        $and: [{ schoolId }, { role }]
      });

      return { users, count }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllUsersOfSchool(findUsersOfSchoolInput: FindUsersOfSchoolInputType): Promise<GetAllUsersResponse> {
    try {
      const { page, limit, schoolId } = findUsersOfSchoolInput;
      const skip = (page - 1) * limit;
      const users = await this.userModel.find({ schoolId }).skip(skip).limit(limit).sort({ createdAt: -1 });
      const count = await this.userModel.countDocuments({ schoolId });

      return { users, count }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
