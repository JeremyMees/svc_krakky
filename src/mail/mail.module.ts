import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/users/users.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
  imports: [forwardRef(() => UserModule)],
})
export class MailModule {}
