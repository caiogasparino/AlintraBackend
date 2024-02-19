import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/consumer';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class WebsocketService {
  private io: Server;
  private readonly logger = new Logger(WebsocketService.name);
  private newsFeedSubject = new Subject<string>();

  constructor(private readonly newsConsumer: KafkaService) {}

  initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    this.io.on('connection', (socket: Socket) => {
      this.logger.log('Client connected to WebSocket server');

      socket.on('disconnect', () => {
        this.logger.log('Client disconnected from WebSocket server');
      });

      socket.on('message', (message: string) => {
        console.log(`Received message from client: ${message}`);
        socket.emit('message', `Echo: ${message}`);
      });
    });

    this.newsConsumer.listen((message) => {
      this.io.emit('news-topic', message);
    });

    server.listen(3001, () => {
      console.log('WebSocket server listening on port 3001');
    });
  }

  broadcastMessage(message: string): void {
    this.newsFeedSubject.next(message);
    this.io.emit('news-topic', message);
    this.logger.log(`Message "${message}" sent to client.`);
  }

  get newsFeedObservable(): Observable<string> {
    return this.newsFeedSubject.asObservable();
  }
}
