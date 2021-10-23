import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddMemberDTO } from './dtos/add-member.dto';
import { CreateJoinWorkspaceTokenDTO } from './dtos/create-join-workspace-token.dto';
import { JoinWorkspaceDTO } from './dtos/join-workspace.dto';
import { WorkspaceDTO } from './dtos/workspace.dto';
import { QueryparamsWorkspaceModel } from './models/queryparams.model';
import { WorkspaceService } from './services/workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get('')
  async getWorkspaces(
    @Query('id') id?: string,
    @Query('member') member?: string,
    @Query('name') name?: string,
    @Query('createdby') createdby?: string,
  ): Promise<HttpResponse> {
    return await this.workspaceService.getWorkspaces({
      id,
      member,
      name,
      createdby,
    });
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  async addWorkspace(@Body() workspace: WorkspaceDTO): Promise<HttpResponse> {
    return await this.workspaceService.addWorkspace(workspace);
  }

  @Post('member')
  @UsePipes(new ValidationPipe())
  async addTeamMember(@Body() addMember: AddMemberDTO): Promise<HttpResponse> {
    return await this.workspaceService.addTeamMember(addMember);
  }

  @Post('create_token')
  @UsePipes(new ValidationPipe())
  async createJoinWorkspaceToken(
    @Body() obj: CreateJoinWorkspaceTokenDTO,
  ): Promise<HttpResponse> {
    return await this.workspaceService.createJoinWorkspaceToken(obj);
  }

  @Post('join_workspace')
  @UsePipes(new ValidationPipe())
  async joinWorkspace(@Body() obj: JoinWorkspaceDTO): Promise<HttpResponse> {
    return await this.workspaceService.joinWorkspace(obj);
  }

  @Patch('')
  @UsePipes(new ValidationPipe())
  async updateWorkspace(
    @Body() workspace: WorkspaceDTO,
  ): Promise<HttpResponse> {
    return await this.workspaceService.updateWorkspace(workspace);
  }

  @Delete('/:id')
  async deleteWorkspace(
    @Param() id: QueryparamsWorkspaceModel,
  ): Promise<HttpResponse> {
    return await this.workspaceService.deleteWorkspace(id);
  }

  @Delete('member/:workspace_id/:user_id')
  async deleteTeamMember(@Param() params: QueryparamsWorkspaceModel) {
    return await this.workspaceService.deleteTeamMember(params);
  }
}
