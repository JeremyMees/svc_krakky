import { forwardRef, Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GetOrDeleteDashboardDTO } from 'src/dashboard/dtos/get.dashboard.dto';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { AddListDTO } from 'src/list/dtos/add-list.dto';
import { DeleteListDTO } from 'src/list/dtos/delete-list.dto';
import { UpdateListDTO } from 'src/list/dtos/update-list.dto';
import { ListService } from 'src/list/services/list.service';
import { HttpResponse } from 'src/shared/models/http-response.model';

@WebSocketGateway(80, { namespace: 'list' })
export class ListGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ListService))
    private listService: ListService,
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
  ) {}

  @SubscribeMessage('add')
  async addList(@MessageBody() data: AddListDTO): Promise<void> {
    const id: string = data.board_id;
    this.listService.addList(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 201 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('update')
  async updateList(@MessageBody() data: UpdateListDTO): Promise<void> {
    const id: string = data.board_id;
    this.listService.updateList(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 200 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('delete')
  async deleteList(@MessageBody() data: DeleteListDTO): Promise<void> {
    const id: string = data.board_id;
    this.listService
      .deleteList(data.board_id)
      .then(async (response: HttpResponse) => {
        const dashboard = await this.getAggregatedDashboard({ board_id: id });
        response.statusCode === 200 ? (response.data = dashboard.data) : null;
        this.server.emit(id, response);
      });
  }

  async getAggregatedDashboard(
    data: GetOrDeleteDashboardDTO,
  ): Promise<HttpResponse> {
    return this.dashboardService
      .getAggregatedDashboard(data)
      .then((dashboard: HttpResponse) => {
        return dashboard;
      });
  }
}
