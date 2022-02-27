import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { WelcomeMailDTO } from '../dtos/welcome-mail.dto';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { GoodbyeMailDTO } from '../dtos/goodbye-mail.dto';
import { UserService } from 'src/users/services/user.service';
import { WorkspaceJoinMailDTO } from '../dtos/workspace-join-mail.dto';
import { UserModel } from 'src/users/models/user.model';
import { ConfigService } from '@nestjs/config';
import { ContactMailDTO } from '../dtos/contact-mail.dto';

@Injectable()
export class MailService {
  url: string = this.configService.get<string>('BASE_URL');

  constructor(
    private mailer: MailerService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async sendWelcomeMail(mail: WelcomeMailDTO): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: 'noreply@krakky.com',
        subject: 'Welcome to Krakky',
        template: './welcome',
        attachments: [
          {
            filename: 'welcome.svg',
            path: __dirname + '/assets/welcome.svg',
            cid: 'welcome',
          },
        ],
        context: {
          username: mail.username,
          urlVerify: `${this.url}/users/verify/${mail.id}`,
          urlDelete: `${this.url}/users/delete/${mail.id}`,
        },
      } as ISendMailOptions)
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

  async sendGoodbyeMail(mail: GoodbyeMailDTO): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: 'noreply@krakky.com',
        subject: 'Goodbye',
        template: './goodbye',
        attachments: [
          {
            filename: 'goodbye.svg',
            path: __dirname + '/assets/goodbye.svg',
            cid: 'goodbye',
          },
        ],
        context: {
          username: mail.username,
        },
      } as ISendMailOptions)
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

  async addMember(mail: {
    token: string;
    workspace_id: string;
    email: string;
  }): Promise<HttpResponse> {
    mail.token = mail.token.split('/').join('_');
    return await this.userService
      .getUser({ email: mail.email })
      .then((res: HttpResponse) => {
        if (res.statusCode === 200) {
          return this.addMemberToWorkspace(mail, res.data);
        } else {
          return this.addNonMemberToWorkspace(mail);
        }
      })
      .catch(() => {
        return this.addNonMemberToWorkspace(mail);
      });
  }

  async addMemberToWorkspace(
    mail: WorkspaceJoinMailDTO,
    user: UserModel,
  ): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: 'noreply@krakky.com',
        subject: "You've been added to a workspace",
        template: './added-member',
        attachments: [
          {
            filename: 'add.svg',
            path: __dirname + '/assets/add.svg',
            cid: 'add',
          },
        ],
        context: {
          username: user.username,
          urlVerify: `${this.url}/workspace/join/${mail.workspace_id}/${mail.token}`,
        },
      } as ISendMailOptions)
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

  async addNonMemberToWorkspace(
    mail: WorkspaceJoinMailDTO,
  ): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: 'noreply@krakky.com',
        subject: "You've been added to a workspace",
        template: './added-non-member',
        attachments: [
          {
            filename: 'add.svg',
            path: __dirname + '/assets/add.svg',
            cid: 'add',
          },
        ],
        context: {
          urlJoin: `${this.url}/home`,
          urlVerify: `${this.url}/workspace/join/${mail.workspace_id}/${mail.token}`,
        },
      } as ISendMailOptions)
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

  async sendContactMail(mail: ContactMailDTO): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: 'info@krakky.com',
        from: `${mail.email}`,
        subject: `Contact krakky user ${mail.username}`,
        template: './contact',
        context: {
          text: mail.text,
          username: mail.username,
          email: mail.email,
        },
      } as ISendMailOptions)
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
}
