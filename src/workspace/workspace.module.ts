import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/users/users.module';
import {
  WorkspaceToken,
  WorkspaceTokenSchema,
} from './schemas/workspace-token.schema';
import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceController } from './workspace.controller';

@Module({
  providers: [WorkspaceService],
  exports: [WorkspaceService],
  controllers: [WorkspaceController],
  imports: [
    forwardRef(() => DashboardModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: WorkspaceToken.name, schema: WorkspaceTokenSchema },
    ]),
  ],
})
export class WorkspaceModule {}
