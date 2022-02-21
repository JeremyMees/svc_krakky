import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeMailDTO } from './dtos/welcome-mail.dto';
import { HttpResponse } from 'src/shared/models/http-response.model';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendWelcomeMail(mail: WelcomeMailDTO): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: '"<Krakky>"info@krakky.com',
        subject: 'Welcome to Krakky',
        template: './welcome',
        context: {
          username: mail.username,
          urlVerify: `http://localhost:4200/users/verify/${mail.id}`,
          urlDelete: `http://localhost:4200/users/delete/${mail.id}`,
        },
      })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Mail is successfully sent',
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while sending email',
        };
      });
  }

  goodbye(username: string, email: string, id: string): void {
    this.mailer.sendMail({
      to: email,
      from: '"<Krakky>"info@krakky.com',
      subject: 'Goodbye',
      template: './user/goodbye',
      context: {
        username,
        urlReverse: `http://localhost:3000/workspace/verify/${id}`,
      },
    });
  }

  addMemberToWorkspace(
    username: string,
    workspace: string,
    email: string,
    id: string,
  ): void {
    this.mailer.sendMail({
      to: email,
      from: '"<Krakky>"info@krakky.com',
      subject: "You've been added to a workspace",
      template: './workspace/added-member',
      context: {
        username,
        workspace,
        urlVerify: `http://localhost:3000/workspace/verify/${id}`,
      },
    });
  }

  addNonMemberToWorkspace(workspace: string, email: string, id: string): void {
    this.mailer.sendMail({
      to: email,
      from: '"<Krakky>"info@krakky.com',
      subject: "You've been added to a workspace",
      template: './workspace/added-non-member',
      context: {
        workspace,
        urlJoin: `http://localhost:3000/workspace/verify/${id}`,
        urlVerify: `http://localhost:3000/workspace/verify/${id}`,
      },
    });
  }
}
