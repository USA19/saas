import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ForgetPasswordInputType, ResetPasswordInputType, User } from 'src/interfaces';
import { UserLoginDto, UserRegisterDto } from 'src/dtos';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
import { createToken } from 'src/utills';

@Injectable()
export class AuthService {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ConfigService,
    public readonly userService: UserService,
    private readonly redisService: RedisService,
  ) { }

  async login(body: UserLoginDto) {
    try {
      const { email, password } = body;

      const user = await this.validateUser(email, password);
      const payload = { user };

      return { user, token: this.jwtService.sign(payload, { secret: this.configService.get("JWT_SECRET") }) };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOne({ email });
      if (!user) throw new BadRequestException('Invalid Password or Email');

      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) throw new BadRequestException('Invalid Password or Email');

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async register(userRegisterInput: UserRegisterDto) {
    try {
      const { email, password } = userRegisterInput
      const user = await this.userService.findOne({ email });

      if (user) {
        throw new BadRequestException('User with this Email already registered');
      }

      const newUserInput = {
        ...userRegisterInput,
        password: await bcrypt.hash(password, 10),
      };

      const newUser = await this.userService.create(newUserInput);
      const payload = { ...newUser };

      return { user: newUser, token: this.jwtService.sign(payload, { secret: this.configService.get("JWT_SECRET") }) };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async forgotPassword(forgetPasswordInputType: ForgetPasswordInputType): Promise<string> {
    try {
      const { email } = forgetPasswordInputType;
      const user = await this.userService.findOne({ email })
      if (user) {
        const { _id } = user
        const token = createToken();
        await this.redisService.set(`FORGOT-${token}`, _id, 60 * 60 * 24)
        //email to the user account
        return "an email has been sent to your rejistered account"
      }

      throw new BadRequestException('Invalid Password or Email');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(resetPasswordInputType: ResetPasswordInputType): Promise<string> {
    try {
      const { token, password } = resetPasswordInputType;
      const findToken = await this.redisService.get(`FORGOT-${token}`);
      if (findToken) {
        const user = await this.userService.findById(findToken);
        const { _id } = user;
        user.password = password;
        await user.save();
        await this.redisService.delete(`FORFORGOT-${token}`);
        return "Password updated successfully"
      }
      throw new BadRequestException('Invalid Token');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
