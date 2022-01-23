import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ListModule } from './list/list.module';
import { TetrisModule } from './tetris/tetris.module';
import { UserModule } from './users/users.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    WorkspaceModule,
    DashboardModule,
    ListModule,
    CardModule,
    TetrisModule,
  ],
})
export class RoutingModule {}
