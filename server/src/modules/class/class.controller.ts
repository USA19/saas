import { Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { CreateClassDto, UpdateClassDto } from 'src/dtos';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Class } from 'src/interfaces';
import { ClassService } from './class.service';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  /**
   * Uses guards
   * @param createClassInput 
   * @returns class 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @SetMetadata('roles', ['super_admin', 'admin', "registrar"])
  async createClass(@Body() createClassInput: CreateClassDto): Promise<Class> {
    return await this.classService.createClassOfSchool(createClassInput);
  }

  /**
   * Uses guards
   * @param id 
   * @param updateClassInput 
   * @returns class 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async updateClass(@Param("id") id: string, @Body() updateClassInput: UpdateClassDto): Promise<Class> {
    return await this.classService.updateClassOfSchool(id, updateClassInput);
  }

  /**
   * Uses guards
   * @param page 
   * @param limit 
   * @param id 
   * @returns all classes 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findAll/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async findAllClasses(@Query('page') page: number, @Query('limit') limit: number, @Param('id') id: string): Promise<Class[]> {
    return await this.classService.findAllClassesOfSchool(id, { page, limit });
  }

  /**
   * Uses guards
   * @param id 
   * @returns one class 
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findById/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async findOneClass(@Param('id') id: string): Promise<Class> {
    return await this.classService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async DeleteClass(@Param('id') id: string): Promise<Class> {
    return await this.classService.deleteClass(id);
  }
}
