import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CredentialsDTO } from './dtos/credentials.dto';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: CredentialsDTO) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateUser(
    @Body() credentials: CredentialsDTO,
  ): Promise<HttpResponse> {
    return await this.authService.validateUser(credentials);
  }
}
