import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { WebsocketService } from '../websocket/service';
import { News } from '../mock';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly websocketService: WebsocketService,
  ) {}

  @Post('send-message')
  async sendMessagePost(@Body() message: string): Promise<void> {
    try {
      await this.appService.sendMessageToKafkaAndBroadcast(message);
    } catch (error) {
      console.error('Error sending message and multicasting:', error);
      throw new Error('Error sending message and multicasting');
    }
  }

  @Get('/get-message')
  async fetchMessageAndBroadcast(): Promise<void> {
    try {
      await this.appService.fetchMessageFromKafkaAndBroadcast();
    } catch (error) {
      console.error(
        'Error fetching message from Kafka and broadcasting:',
        error,
      );
      throw new Error('Error fetching message from Kafka and broadcasting');
    }
  }

  @Get('news')
  findAll(): News[] {
    return this.appService.findAll();
  }

  @Get('/news-feed')
  async newsFeed(): Promise<void> {
    this.websocketService.broadcastMessage('Message to Kafka');
  }
}
