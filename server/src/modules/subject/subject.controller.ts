import { Body, Controller, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { CreateSubjectInputDto, UpdateSubjectInputDto } from 'src/dtos';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Subject } from 'src/interfaces';
import { SubjectService } from './subject.service';

@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  /**
   * Uses guards
   * @param createSubjectInput 
   * @returns class 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @SetMetadata('roles', ['super_admin', 'admin', "registrar"])
  async createSubject(@Body() createSubjectInput: CreateSubjectInputDto): Promise<Subject> {
    return await this.subjectService.createSubjectOfClass(createSubjectInput);
  }

  /**
   * Uses guards
   * @param id 
   * @param updateSubjectInput 
   * @returns class 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar', 'teacher'])
  async updateSubject(@Param("id") id: string, @Body() updateSubjectInput: UpdateSubjectInputDto): Promise<Subject> {
    return await this.subjectService.updateSubjectOfClass(id, updateSubjectInput);
  }

  /**
   * Uses guards
   * @param page 
   * @param limit 
   * @param id 
   * @returns all classes 
   */
  @UseGuards(JwtAuthGuard)
  @Get('findAll/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async findAllClasses(@Query('page') page: number, @Query('limit') limit: number, @Param('id') id: string): Promise<Subject[]> {
    return await this.subjectService.findAllSubjectsOfClassesOfSchool(id, { page, limit });
  }

  /**
   * Uses guards
   * @param id 
   * @returns one class 
   */
  @UseGuards(JwtAuthGuard)
  @Get('findById/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async findOneSubject(@Param('id') id: string): Promise<Subject> {
    return await this.subjectService.findById(id);
  }
}
