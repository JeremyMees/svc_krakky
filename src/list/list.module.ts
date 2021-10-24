import { Module } from '@nestjs/common';
import { ListService } from './services/list.service';
import { ListController } from './list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from 'src/list/schemas/list.schema';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { DashboardService } from 'src/dashboard/services/dashboard.service';

@Module({
  providers: [ListService],
  exports: [ListService],
  controllers: [ListController],
  imports: [
    DashboardModule,
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }]),
  ],
})
export class ListModule {}
