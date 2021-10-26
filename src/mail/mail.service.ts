import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  welcome(username: string, email: string, id: string): void {
    // pagina maken in de front end waar de urlverify en urlDelete word aan geroepen
    //in plaats van rechtstreeks zodat ze iets visueel zien
    //en niet rechtstreeks verbinden met de databse
    this.mailer.sendMail({
      to: email,
      from: '"<Krakky>"CronusKaban@gmail.com',
      subject: 'Welcome',
      template: './user/welcome',
      context: {
        username,
        urlVerify: `http://localhost:3000/users/verify/${id}`,
        urlDelete: `http://localhost:3000/users?id=${id}`,
      },
    });
  }

  goodbye(username: string, email: string, id: string): void {
    this.mailer.sendMail({
      to: email,
      from: '"<Krakky>"CronusKaban@gmail.com',
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
      from: '"<Krakky>"CronusKaban@gmail.com',
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
      from: '"<Krakky>"CronusKaban@gmail.com',
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
