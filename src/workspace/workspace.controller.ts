import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { WorkspaceDTO } from './dtos/workspace.dto';
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
  async addWorkspace(@Body() workspace: WorkspaceDTO): Promise<HttpResponse> {
    return await this.workspaceService.addWorkspace(workspace);
  }
}
