import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddDashboardDTO } from './dtos/add-dashboard.dto';
import { UpdateDashboardDTO } from './dtos/update-dashboard.dto';
import { QueryparamsDashboardModel } from './models/queryparams-dashboard.model';
import { DashboardService } from './services/dashboard.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Dashboards')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('')
  async getDashboards(
    @Query('id') id?: string,
    @Query('board_id') board_id?: string,
    @Query('title') title?: string,
    @Query('createdby') createdby?: string,
    @Query('workspace') workspace?: string,
  ): Promise<HttpResponse> {
    return await this.dashboardService.getDashboards({
      id,
      board_id,
      title,
      createdby,
      workspace,
    });
  }

  @Get('/:board_id')
  async getAggregatedDashboard(
    @Param() queryparams: QueryparamsDashboardModel,
  ): Promise<HttpResponse> {
    return await this.dashboardService.getAggregatedDashboard(queryparams);
  }

  @Post('')
  async addDashboard(
    @Body() dashboard: AddDashboardDTO,
  ): Promise<HttpResponse> {
    return await this.dashboardService.addDashboard(dashboard);
  }

  @Patch('')
  async updateDashboard(
    @Body() dashboard: UpdateDashboardDTO,
  ): Promise<HttpResponse> {
    return await this.dashboardService.updateDashboard(dashboard);
  }

  @Delete('/:board_id')
  async deleteList(
    @Param() param: QueryparamsDashboardModel,
  ): Promise<HttpResponse> {
    return await this.dashboardService.deleteDashboard(param.board_id);
  }
}
