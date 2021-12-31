import { forwardRef, Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AddCardDTO } from 'src/card/dtos/add-card.dto';
import { DeleteCardDTO } from 'src/card/dtos/delete-card.dto';
import { UpdateCardDTO } from 'src/card/dtos/update-card.dto';
import { CardService } from 'src/card/services/card.service';
import { UpdateDashboardDTO } from 'src/dashboard/dtos/update-dashboard.dto';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { AddListDTO } from 'src/list/dtos/add-list.dto';
import { DeleteListDTO } from 'src/list/dtos/delete-list.dto';
import { UpdateListDTO } from 'src/list/dtos/update-list.dto';
import { ListService } from 'src/list/services/list.service';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { GetOrDeleteDashboardDTO } from '../../dashboard/dtos/get.dashboard.dto';

@WebSocketGateway(80, {
  namespace: 'dashboard',
  cors: {
    origin: '*',
  },
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
})
export class DashboardGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
    @Inject(forwardRef(() => ListService))
    private listService: ListService,
  ) {}

  @SubscribeMessage('get-dashboard')
  async getDashboard(
    @MessageBody() data: GetOrDeleteDashboardDTO,
  ): Promise<void> {
    const id: string = data.board_id;
    this.getAggregatedDashboard(data).then((response: HttpResponse) => {
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('update-dashboard')
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

  @SubscribeMessage('delete-dashboard')
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

  @SubscribeMessage('add-list')
  async addList(@MessageBody() data: AddListDTO): Promise<void> {
    const id: string = data.board_id;
    this.listService.addList(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 201 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('update-list')
  async updateList(@MessageBody() data: UpdateListDTO): Promise<void> {
    const id: string = data.board_id;
    this.listService.updateList(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 200 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('delete-list')
  async deleteList(@MessageBody() data: DeleteListDTO): Promise<void> {
    const id: string = data.board_id;
    this.listService
      .deleteList(data._id)
      .then(async (response: HttpResponse) => {
        const dashboard = await this.getAggregatedDashboard({ board_id: id });
        response.statusCode === 200 ? (response.data = dashboard.data) : null;
        this.server.emit(id, response);
      });
  }

  @SubscribeMessage('add-card')
  async addCard(@MessageBody() data: AddCardDTO): Promise<void> {
    const id: string = data.board_id;
    this.cardService.addCard(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 201 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('update-card')
  async updateCard(@MessageBody() data: UpdateCardDTO): Promise<void> {
    const id: string = data.board_id;
    this.cardService.updateCard(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 200 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('delete-card')
  async deleteCard(@MessageBody() data: DeleteCardDTO): Promise<void> {
    const id: string = data.board_id;
    this.cardService.deleteCard(data).then(async (response: HttpResponse) => {
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
