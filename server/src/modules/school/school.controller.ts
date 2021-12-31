import { Controller, Post, Body, UseGuards, SetMetadata, Param, Query, Get, Put } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateSchoolDto, UpdateSchoolDto } from 'src/dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { GetAllSchoolsResponse, GetAllUsersResponse, School } from 'src/interfaces';
import { RoleType } from 'src/models/user.model';
import { SchoolService } from './school.service';

@ApiTags('School')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) { }

  /**
   * Uses guards
   * @param body 
   * @returns school 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @SetMetadata('roles', ['super_admin'])
  async createSchool(@Body() body: CreateSchoolDto): Promise<School> {
    return await this.schoolService.createSchool(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update/:id')
  @SetMetadata('roles', ['super_admin', 'admin'])
  async updateSchool(@Param('id') id: string, @Body() updateShoolInputType: UpdateSchoolDto): Promise<School> {
    return await this.schoolService.updateSchool(id, updateShoolInputType);
  }

  /**
   * Uses guards
   * @param id 
   * @returns school 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('delete/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @SetMetadata('roles', ['super_admin'])
  async deleteSchool(@Param('id') id: string): Promise<string> {
    return await this.schoolService.deleteSchool(id);
  }

  /**
   * Uses guards
   * @param page 
   * @param limit 
   * @returns schools 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findAll')
  @SetMetadata('roles', ['super_admin'])
  async findSchools(@Query('page') page: number, @Query('limit') limit: number): Promise<GetAllSchoolsResponse> {
    return await this.schoolService.findAll({ page, limit });
  }

  /**
   * Uses guards
   * @param id 
   * @returns school 
   */
  @UseGuards(JwtAuthGuard)
  @Post('findById/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async findSchool(@Param('id') id: string): Promise<School> {
    return await this.schoolService.findById(id);
  }

  /**
   * Uses guards
   * @param schoolId 
   * @param page 
   * @param limit 
   * @returns school student 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findSchoolStudent/:schoolId')
  @ApiParam({
    name: 'schoolId',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', "registrar"])
  async findSchoolStudent(@Param("schoolId") schoolId: string, @Query('page') page: number, @Query('limit') limit: number): Promise<GetAllUsersResponse> {
    return await this.schoolService.findAllStudentsOfSchool({ page, limit, schoolId, role: RoleType.STUDENT });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findSchoolTeachers/:schoolId')
  @ApiParam({
    name: 'schoolId',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', "registrar"])
  async findSchoolTeachers(@Param("schoolId") schoolId: string, @Query('page') page: number, @Query('limit') limit: number): Promise<GetAllUsersResponse> {
    return await this.schoolService.findAllStudentsOfSchool({ page, limit, schoolId, role: RoleType.TEACHER });
  }
}
