import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from 'src/card/card.module';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { ListModule } from 'src/list/list.module';
import { DashboardGateway } from './dashboard/dashboard.gateway';
import { ListGateway } from './list/list.gateway';
import { CardGateway } from './card/card.gateway';

@Module({
  providers: [DashboardGateway, ListGateway, CardGateway],
  imports: [
    forwardRef(() => ListModule),
    forwardRef(() => CardModule),
    forwardRef(() => DashboardModule),
  ],
})
export class GatewaysModule {}
