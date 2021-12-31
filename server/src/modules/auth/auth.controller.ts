import { Controller, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ForgotPasswordInput, ResetPasswordInput, UserLoginDto, UserRegisterDto } from 'src/dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { LoginOutputType } from 'src/interfaces';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Uses guards
   * @param body 
   * @returns login 
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: UserLoginDto): Promise<LoginOutputType> {
    return await this.authService.login(body);
  }

  /**
   * Posts auth controller
   * @param userRegisterInput 
   * @returns register 
   */
  @Post('signup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['super_admin', 'admin', 'registrar'])
  async register(@Body() userRegisterInput: UserRegisterDto): Promise<LoginOutputType> {
    return await this.authService.register(userRegisterInput);
  }

  /**
   * Posts auth controller
   * @param forgotPasswordInput 
   * @returns password 
   */
  @Post('forgetPassword')
  async forgetPassword(@Body() forgotPasswordInput: ForgotPasswordInput): Promise<string> {
    return await this.authService.forgotPassword(forgotPasswordInput);
  }

  /**
   * Posts auth controller
   * @param resetPasswordInput 
   * @returns password 
   */
  @Post('forgetPassword')
  @UseGuards(JwtAuthGuard)
  async resetPassword(@Body() resetPasswordInput: ResetPasswordInput): Promise<string> {
    return await this.authService.resetPassword(resetPasswordInput);
  }
}
