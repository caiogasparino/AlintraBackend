import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway()
@Injectable()
export class WebsocketGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);

  broadcastMessage(message: string): void {
    try {
      this.server.clients.forEach(
        (client: { readyState: number; send: (arg0: string) => void }) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        },
      );
      this.logger.log('Message broadcasted successfully.');
    } catch (error) {
      this.logger.error('Error broadcasting message:', error.stack);
      throw new Error('Error broadcasting message');
    }
  }
}
