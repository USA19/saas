import { Body, Controller, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { UpdateUserDto } from 'src/dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { GetAllUsersResponse, User } from 'src/interfaces';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Gets user controller
   * @param query 
   * @returns all 
   */
  @Get('findAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query('page') page: number, @Query('limit') limit: number): Promise<GetAllUsersResponse> {
    return await this.userService.findAll({ page, limit });
  }

  /**
   * Gets user controller
   * @param id 
   * @returns by id 
   */
  @Get('findById/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async findById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  /**
   * Gets user controller
   * @param id 
   * @returns user 
   */
  @Post('delete/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async deleteUser(@Param('id') id: string): Promise<string> {
    return await this.userService.deleteUser(id);
  }

  /**
   * Puts user controller
   * @param _id 
   * @param userUpdateInput 
   * @returns user 
   */
  @Put('update/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') id: string, @Body() userUpdateInput: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(id, userUpdateInput);
  }
}
