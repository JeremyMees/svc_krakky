import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { GoodbyeMailDTO } from './dtos/goodbye-mail.dto';
import { WelcomeMailDTO } from './dtos/welcome-mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('welcome')
  async sendWelcomeMail(@Body() mail: WelcomeMailDTO): Promise<HttpResponse> {
    return await this.mailService.sendWelcomeMail(mail);
  }
}
