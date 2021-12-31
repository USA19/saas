import { Date, Document } from 'mongoose';
import { RoleType } from 'src/models/user.model';

export class User extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  imageUrl: string;
  bio: string;
  description: string;
  resetToken: string;
  resetTokenExpiration: Date;
  schoolId: string;
  profileImageUrl: string;
}

export class School extends Document {
  name: string;
  principle: User;
  bio?: string;
  description?: string;
  phone: string;
  imageUrl: string;
  teachers: User[]
}

export class Class extends Document {
  name: string;
  description?: string;
  teachers: User[]
  schoolId: string
}

export class Subject extends Document {
  name: string;
  description?: string;
  teacher: User | string;
  schoolId: string;
  classId: string;
}
export interface PaginationOptionType {
  page: number;
  limit: number
}

export interface FindUsersOfSomeRoleOfSchoolInputType extends PaginationOptionType {
  schoolId: string;
  role: RoleType
}

export interface FindUsersOfSchoolInputType extends PaginationOptionType {
  schoolId: string;
}
export interface LoginOutputType {
  user: User,
  token: string
}

export interface GetAllUsersResponse {
  users: User[],
  count: number
}
export class ResetPasswordInputType {
  password: string;
  token: string
}

export class ForgetPasswordInputType {
  email: string
}

export interface GetAllSchoolsResponse {
  schools: School[],
  count: number
}