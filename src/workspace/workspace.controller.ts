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
import { AddMemberDTO } from './dtos/add-member.dto';
import { CreateJoinWorkspaceTokenDTO } from './dtos/create-join-workspace-token.dto';
import { JoinWorkspaceDTO } from './dtos/join-workspace.dto';
import { WorkspaceDTO } from './dtos/workspace.dto';
import { QueryparamsWorkspaceModel } from './models/queryparams.model';
import { WorkspaceService } from './services/workspace.service';
import { Public } from 'src/shared/decorator/skip-auth.decorator';
import { UserService } from 'src/users/services/user.service';
import { MemberDTO } from './dtos/member.dto';
import { UpdateMemberDTO } from './dtos/update-member.dto';
import { IfMemberDTO } from './dtos/if-member.dto';
@Controller('workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private userService: UserService,
  ) {}

  @Get('')
  async getWorkspaces(
    @Query('id') id?: string,
    @Query('workspace_id') workspace_id?: string,
    @Query('member') member?: string,
    @Query('name') name?: string,
    @Query('createdby') createdby?: string,
  ): Promise<HttpResponse> {
    return await this.workspaceService.getWorkspaces({
      id,
      workspace_id,
      member,
      name,
      createdby,
    });
  }

  @Get('aggregated')
  async getAggregatedWorkspaces(
    @Query('id') id?: string,
    @Query('workspace_id') workspace_id?: string,
    @Query('member') member?: string,
    @Query('name') name?: string,
    @Query('createdby') createdby?: string,
  ): Promise<HttpResponse> {
    return await this.workspaceService.getAggregatedWorkspaces({
      id,
      workspace_id,
      member,
      name,
      createdby,
    });
  }

  @Post('')
  async addWorkspace(@Body() workspace: WorkspaceDTO): Promise<HttpResponse> {
    return await this.workspaceService.addWorkspace(workspace);
  }

  @Post('member')
  async addTeamMember(@Body() addMember: AddMemberDTO): Promise<HttpResponse> {
    return await this.workspaceService.addTeamMember(addMember);
  }

  @Post('members')
  async getMembers(@Body() members: Array<MemberDTO>): Promise<HttpResponse> {
    return await this.userService.getMembers(members);
  }

  @Post('is_member')
  async checkIfMember(@Body() member: IfMemberDTO): Promise<HttpResponse> {
    return await this.workspaceService.checkIfMember(member);
  }

  @Post('create_token')
  async createJoinWorkspaceToken(
    @Body() obj: CreateJoinWorkspaceTokenDTO,
  ): Promise<HttpResponse> {
    return await this.workspaceService.createJoinWorkspaceToken(obj);
  }

  @Public()
  @Post('join_workspace')
  async joinWorkspace(@Body() obj: JoinWorkspaceDTO): Promise<HttpResponse> {
    return await this.workspaceService.joinWorkspace(obj);
  }

  @Patch('')
  async updateWorkspace(
    @Body() workspace: WorkspaceDTO,
  ): Promise<HttpResponse> {
    return await this.workspaceService.updateWorkspace(workspace);
  }

  @Patch('member')
  async updateTeamMember(
    @Body() members: UpdateMemberDTO,
  ): Promise<HttpResponse> {
    return await this.workspaceService.updateTeamMember(members);
  }

  @Delete('/:workspace_id')
  async deleteWorkspace(
    @Param() workspace_id: QueryparamsWorkspaceModel,
  ): Promise<HttpResponse> {
    return await this.workspaceService.deleteWorkspace(workspace_id);
  }

  @Delete('member/:workspace_id/:user_id')
  async deleteTeamMember(@Param() params: QueryparamsWorkspaceModel) {
    return await this.workspaceService.deleteTeamMember(params);
  }
}
