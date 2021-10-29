import { forwardRef, Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { CardService } from 'src/card/services/card.service';
import { AddCardDTO } from 'src/card/dtos/add-card.dto';
import { UpdateCardDTO } from 'src/card/dtos/update-card.dto';
import { GetOrDeleteDashboardDTO } from 'src/dashboard/dtos/get.dashboard.dto';
import { DeleteCardDTO } from 'src/card/dtos/delete-card.dto';

@WebSocketGateway(80, { namespace: 'card' })
export class CardGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
  ) {}

  @SubscribeMessage('add')
  async addCard(@MessageBody() data: AddCardDTO): Promise<void> {
    const id: string = data.board_id;
    this.cardService.addCard(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 201 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('update')
  async updateCard(@MessageBody() data: UpdateCardDTO): Promise<void> {
    const id: string = data.board_id;
    this.cardService.updateCard(data).then(async (response: HttpResponse) => {
      const dashboard = await this.getAggregatedDashboard({ board_id: id });
      response.statusCode === 200 ? (response.data = dashboard.data) : null;
      this.server.emit(id, response);
    });
  }

  @SubscribeMessage('delete')
  async deleteCard(@MessageBody() data: DeleteCardDTO): Promise<void> {
    const id: string = data.board_id;
    this.cardService
      .deleteCard({ card_id: data.card_id })
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
