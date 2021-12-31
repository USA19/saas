import { IsEmail, IsDate, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum, MaxLength, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RoleType } from 'src/models/user.model';

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(RoleType)
  role?: string;

  @ApiProperty()
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schoolId: string
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  schoolId: string
}

export class CreateSchoolDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  principle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  phone: string;
}

export class UpdateSchoolDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  principle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  teachers
}

export class CreateClassDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  schoolId: string;
}

export class UpdateClassDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  teachers
}

export class ForgotPasswordInput {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;
}

export class ResetPasswordInput {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(14)
  password: string;

  @ApiProperty()
  @IsString()
  token: string
}

export class CreateSubjectInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  classId: string;
}

export class UpdateSubjectInputDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  teacher
}