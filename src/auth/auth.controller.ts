import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CredentialsDTO } from './dtos/credentials.dto';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/skip-auth.decorator';
import { UserModel } from 'src/users/models/user.model';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: CredentialsDTO) {
    return this.authService.login(user);
  }

  @Public()
  @Post('token')
  async getToken(@Body() user: CredentialsDTO) {
    const fetchedUser = await this.authService.login(user);
    return {
      token_expire_time: fetchedUser.data.token_expire_time,
      acces_token: fetchedUser.data.acces_token,
    };
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
