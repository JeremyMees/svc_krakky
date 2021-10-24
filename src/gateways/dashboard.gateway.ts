import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(80, { namespace: 'dashboard' })
export class DashboardGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('get')
  getWorkspaces(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }
}
