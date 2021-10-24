import { Module } from '@nestjs/common';
import { DashboardGateway } from '../gateways/dashboard.gateway';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  providers: [DashboardService, DashboardGateway],
  controllers: [DashboardController],
  exports: [DashboardService],
  imports: [
    WorkspaceModule,
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
    ]),
  ],
})
export class DashboardModule {}
