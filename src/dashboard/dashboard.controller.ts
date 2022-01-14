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
import { MemberDTO } from 'src/workspace/dtos/member.dto';
import { UserService } from 'src/users/services/user.service';
import { IfMemberDTO } from './dtos/if-member-dashboard.dto';
import { UpdateMemberDTO } from './dtos/update-member-dashboard.dto';
import { AddMemberDTO } from './dtos/add-member-dashboard.dto';
@ApiTags('Dashboards')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
  ) {}

  @Get('')
  async getDashboards(
    @Query('id') id?: string,
    @Query('board_id') board_id?: string,
    @Query('member') member?: string,
    @Query('title') title?: string,
    @Query('createdby') createdby?: string,
    @Query('workspace_id') workspace_id?: string,
  ): Promise<HttpResponse> {
    return await this.dashboardService.getDashboards({
      id,
      board_id,
      title,
      createdby,
      workspace_id,
      member
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

  @Post('member')
  async addTeamMember(@Body() addMember: AddMemberDTO): Promise<HttpResponse> {
    return await this.dashboardService.addTeamMember(addMember);
  }

  @Post('members')
  async getMembers(@Body() members: Array<MemberDTO>): Promise<HttpResponse> {
    return await this.userService.getMembers(members);
  }

  @Post('is_member')
  async checkIfMember(@Body() member: IfMemberDTO): Promise<HttpResponse> {
    return await this.dashboardService.checkIfMember(member);
  }

  @Patch('')
  async updateDashboard(
    @Body() dashboard: UpdateDashboardDTO,
  ): Promise<HttpResponse> {
    return await this.dashboardService.updateDashboard(dashboard);
  }

  @Patch('member')
  async updateTeamMember(
    @Body() members: UpdateMemberDTO,
  ): Promise<HttpResponse> {
    return await this.dashboardService.updateTeamMember(members);
  }

  @Delete('/:board_id')
  async deleteList(
    @Param() param: QueryparamsDashboardModel,
  ): Promise<HttpResponse> {
    return await this.dashboardService.deleteDashboard(param.board_id);
  }

  @Delete('member/:board_id/:user_id')
  async deleteTeamMember(@Param() params: QueryparamsDashboardModel) {
    return await this.dashboardService.deleteTeamMember(params);
  }
}
