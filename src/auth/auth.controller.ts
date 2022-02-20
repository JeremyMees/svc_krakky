import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Request,
  Response,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CredentialsDTO } from './dtos/credentials.dto';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/skip-auth.decorator';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getCurrentUser(@Request() req: any): Promise<HttpResponse> {
    return req.user;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Response() res: any) {
    if (req.user.statusCode === 200) {
      res.cookie('krakkyAccessToken', req.user.data.access_token, {
        expires: new Date(req.user.data.token_expire_time),
        sameSite: 'lax',
        httpOnly: true,
      });
      delete req.user.data;
      return res.send(req.user);
    } else {
      return { statusCode: 400, message: "Error couldn't log in" };
    }
  }

  @Public()
  @Post('token')
  async getToken(@Body() user: CredentialsDTO) {
    return await this.authService.getToken(user);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateUser(
    @Body() credentials: CredentialsDTO,
  ): Promise<HttpResponse> {
    return await this.authService.validateUser(credentials);
  }
}
