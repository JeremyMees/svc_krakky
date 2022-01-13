import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { EmailDTO } from './dtos/email.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { UserDTO } from './dtos/user.dto';
import { UsernameDTO } from './dtos/username.dto';
import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/skip-auth.decorator';
import { UpdateUserImgDTO } from './dtos/update-user-img.dto';
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('')
  async getUser(
    @Query('id') id?: string,
    @Query('username') username?: string,
    @Query('email') email?: string,
  ): Promise<HttpResponse> {
    return await this.userService.getUser({ id, username, email });
  }

  @Public()
  @Get('verify/:id')
  async verifyUser(@Param() param: { id: string }): Promise<HttpResponse> {
    return await this.userService.verifyUser(param);
  }

  @Public()
  @Post('')
  async addUser(@Body() user: UserDTO): Promise<HttpResponse> {
    return await this.userService.addUser(user);
  }

  @Public()
  @Post('username')
  async checkUsernameIsUsed(@Body() user: UsernameDTO): Promise<HttpResponse> {
    return await this.userService.checkUsernameIsUsed(user);
  }

  @Public()
  @Post('create_token')
  async createResetPasswordToken(
    @Body() email: EmailDTO,
  ): Promise<HttpResponse> {
    return await this.userService.createResetPasswordToken(email);
  }

  @Public()
  @Post('password_reset')
  async resetPassword(
    @Body() resetPassword: ResetPasswordDTO,
  ): Promise<HttpResponse> {
    return await this.userService.resetPassword(resetPassword);
  }

  @Patch('')
  async patchUser(
    @Body() data: { user: UserDTO; updatedUser: UserDTO },
  ): Promise<HttpResponse> {
    return await this.userService.patchUser(data);
  }

  @Patch('/img')
  async patchUserImage(@Body() data: UpdateUserImgDTO): Promise<HttpResponse> {
    return await this.userService.patchUserImage(data);
  }

  @Public()
  @Delete('')
  async deleteUser(
    @Query('id') id?: string,
    @Query('username') username?: string,
    @Query('email') email?: string,
  ): Promise<HttpResponse> {
    return await this.userService.deleteUser({ id, username, email });
  }
}
