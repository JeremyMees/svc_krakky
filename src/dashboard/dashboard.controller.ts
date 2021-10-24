import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddCardDTO } from '../card/dtos/add-card.dto';
import { AddDashboardDTO } from './dtos/add-dashboard.dto';
import { UpdateDashboardDTO } from './dtos/update-dashboard.dto';
import { QueryparamsDashboardModel } from './models/queryparams-dashboard.model';
import { DashboardService } from './services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('')
  async getDashboars(
    @Query('id') id?: string,
    @Query('board_id') board_id?: string,
    @Query('title') title?: string,
    @Query('createdby') createdby?: string,
  ): Promise<HttpResponse> {
    return await this.dashboardService.getDashboards({
      id,
      board_id,
      title,
      createdby,
    });
  }

  @Get('/:board_id')
  async getAggregatedDashboard(
    @Param() queryparams: QueryparamsDashboardModel,
  ): Promise<HttpResponse> {
    return await this.dashboardService.getAggregatedDashboard(queryparams);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  async addDashboard(
    @Body() dashboard: AddDashboardDTO,
  ): Promise<HttpResponse> {
    return await this.dashboardService.addDashboard(dashboard);
  }

  @Patch('')
  @UsePipes(new ValidationPipe())
  async updateDashboard(
    @Body() dashboard: UpdateDashboardDTO,
  ): Promise<HttpResponse> {
    return await this.dashboardService.updateDashboard(dashboard);
  }
}
