import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { WebsocketService } from '../websocket/service';
import { NewsConsumer } from '../kafka/consumer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly websocketService: WebsocketService,
    private readonly newsConsumer: NewsConsumer,
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

  @Get('listen')
  async listenForNews(): Promise<void> {
    try {
      await this.newsConsumer.listen((message) => {
        console.log('Received news message:', message);
      });
    } catch (error) {
      console.error('Error listening for Kafka news:', error);
      throw new Error('Error listening for Kafka news');
    }
  }

  @Get('latest-news')
  async getLatestNews(): Promise<string[]> {
    try {
      return this.appService.getLatestNews();
    } catch (error) {
      console.error('Error getting latest news:', error);
      throw new Error('Error getting latest news');
    }
  }

  @Get('/news-feed')
  async newsFeed(): Promise<void> {
    try {
      // Initialize real-time news feed
      this.websocketService.initializeNewsFeed();
    } catch (error) {
      console.error('Error initializing real-time news feed:', error);
      throw new Error('Error initializing real-time news feed');
    }
  }

  @Get('/send-message')
  async sendMessageGet(): Promise<void> {
    try {
      await this.appService.sendMessageToKafkaAndBroadcast('Message to Kafka');
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw new Error('Error sending message to Kafka');
    }
  }
}
