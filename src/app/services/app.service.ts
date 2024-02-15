import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/gateway';
import { NewsProducer } from '../kafka/producer';
import { NewsConsumer } from '../kafka/consumer';

@Injectable()
export class AppService {
  constructor(
    private readonly kafkaProducer: NewsProducer,
    private readonly newsConsumer: NewsConsumer,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async sendMessageToKafkaAndBroadcast(message): Promise<void> {
    try {
      await this.kafkaProducer.sendMessage();
      this.websocketGateway.broadcastMessage(message);
      console.log('Message sent to Kafka and broadcasted successfully.');
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Error sending message to Kafka or broadcasting:',
          error.message,
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw new Error('Error sending message to Kafka or broadcasting.');
    }
  }

  async listenForKafkaMessagesAndBroadcast(): Promise<void> {
    await this.newsConsumer
      .listen((message) => {
        this.websocketGateway.broadcastMessage(message);
      })
      .catch((error) => {
        console.error('Error listening for Kafka messages:', error);
      });
  }

  async getLatestNews(): Promise<string[]> {
    const latestNews: string[] = [];
    await this.newsConsumer
      .listen((message) => {
        latestNews.push(message);
      })
      .catch((error) => {
        console.error('Error getting latest news from Kafka:', error);
      });
    return latestNews;
  }
}
