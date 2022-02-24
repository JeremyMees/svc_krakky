import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeMailDTO } from './dtos/welcome-mail.dto';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { GoodbyeMailDTO } from './dtos/goodbye-mail.dto';
import { UserService } from 'src/users/services/user.service';
import { WorkspaceJoinMailDTO } from './dtos/workspace-join-mail.dto';
import { UserModel } from 'src/users/models/user.model';

@Injectable()
export class MailService {
  constructor(
    private mailer: MailerService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

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

  async sendGoodbyeMail(mail: GoodbyeMailDTO): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: '"<Krakky>"info@krakky.com',
        subject: 'Goodbye',
        template: './goodbye',
        context: {
          username: mail.username,
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
        from: '"<Krakky>"info@krakky.com',
        subject: "You've been added to a workspace",
        template: './added-member',
        context: {
          username: user.username,
          urlVerify: `http://localhost:3000/workspace/join/${mail.workspace_id}/${mail.token}`,
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

  async addNonMemberToWorkspace(
    mail: WorkspaceJoinMailDTO,
  ): Promise<HttpResponse> {
    return this.mailer
      .sendMail({
        to: mail.email,
        from: '"<Krakky>"info@krakky.com',
        subject: "You've been added to a workspace",
        template: './added-non-member',
        context: {
          urlJoin: `http://localhost:3000/home`,
          urlVerify: `http://localhost:3000/workspace/join/${mail.workspace_id}/${mail.token}`,
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
}
