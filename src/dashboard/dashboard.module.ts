import { forwardRef, Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ListModule } from 'src/list/list.module';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
  imports: [
    forwardRef(() => WorkspaceModule),
    forwardRef(() => ListModule),
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
    ]),
  ],
})
export class DashboardModule {}
