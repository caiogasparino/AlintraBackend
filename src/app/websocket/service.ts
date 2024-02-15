import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NewsConsumer } from '../kafka/consumer';

@Injectable()
export class WebsocketService {
  private io: Server;
  private readonly logger = new Logger(WebsocketService.name);

  constructor(private readonly newsConsumer: NewsConsumer) {}

  initialize(server: any) {
    try {
      this.io = new Server(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      this.newsConsumer.listen((message) => {
        this.io.emit('news', message);
      });

      this.io.on('connection', (socket: Socket) => {
        this.logger.log('Client connected to WebSocket server');

        socket.on('disconnect', () => {
          this.logger.log('Client disconnected from WebSocket server');
        });
      });
    } catch (error) {
      this.logger.error('Error initializing WebSocket server:', error.stack);
      throw new Error('Error initializing WebSocket server');
    }
  }

  initializeNewsFeed() {
    try {
      this.newsConsumer.listen((message) => {
        this.io.emit('news', message);
      });
    } catch (error) {
      this.logger.error('Error initializing news feed:', error.stack);
      throw new Error('Error initializing news feed');
    }
  }
}
