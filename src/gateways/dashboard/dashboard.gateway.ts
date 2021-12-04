import { forwardRef, Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UpdateDashboardDTO } from 'src/dashboard/dtos/update-dashboard.dto';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { GetOrDeleteDashboardDTO } from '../../dashboard/dtos/get.dashboard.dto';

@WebSocketGateway(80, {
  namespace: 'dashboard',
  cors: {
    origin: '*',
  },
})
export class DashboardGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
  ) {}

  @SubscribeMessage('get')
  async getDashboard(
    @MessageBody() data: GetOrDeleteDashboardDTO,
  ): Promise<void> {
    const id: string = data.board_id;
    this.getAggregatedDashboard(data).then((response: HttpResponse) => {
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('update')
  async updateDashboard(
    @MessageBody() data: UpdateDashboardDTO,
  ): Promise<void> {
    const id: string = data.board_id;
    this.dashboardService
      .updateDashboard(data)
      .then(async (response: HttpResponse) => {
        const dashboard = await this.getAggregatedDashboard({ board_id: id });
        response.statusCode === 200 ? (response.data = dashboard.data) : null;
        this.server.emit(id, response);
      });
  }

  @SubscribeMessage('delete')
  async deleteDashboard(
    @MessageBody() data: GetOrDeleteDashboardDTO,
  ): Promise<void> {
    const id: string = data.board_id;
    this.dashboardService
      .deleteDashboard(data.board_id)
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
