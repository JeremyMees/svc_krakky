import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { UserDTO } from './dtos/user.dto';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async getUser(
    @Query('id') id?: string,
    @Query('username') username?: string,
    @Query('email') email?: string,
  ): Promise<HttpResponse> {
    return await this.userService.getUser({ id, username, email });
  }

  @Post('')
  async addUser(@Body() user: UserDTO): Promise<HttpResponse> {
    return await this.userService.addUser(user);
  }

  @Patch('')
  async patchUser(
    @Body() data: { user: UserDTO; updatedUser: UserDTO },
  ): Promise<HttpResponse> {
    return await this.userService.patchUser(data);
  }

  @Delete('')
  async deleteUser(
    @Query('id') id?: string,
    @Query('username') username?: string,
    @Query('email') email?: string,
  ): Promise<HttpResponse> {
    return await this.userService.deleteUser({ id, username, email });
  }
}
