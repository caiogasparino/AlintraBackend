import { WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class WebsocketModule {
  private server: Server;
  private readonly logger = new Logger(WebsocketModule.name);

  afterInit(server: Server) {
    this.server = server;

    console.log('WebSocket server initialized');
  }

  handleConnection(client) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendMessage(message: string) {
    this.server.emit('message', message);
  }

  broadcastMessage(message: string): void {
    try {
      this.server.emit('message', message);
      this.logger.log(`Message "${message}" broadcasted successfully.`);
    } catch (error) {
      this.logger.error('Error broadcasting message:', error.stack);
      throw new Error('Error broadcasting message');
    }
  }
}
