import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '../kafka/producer';
import { KafkaService } from '../kafka/consumer';
import { News, data } from '../mock';
import { WebsocketService } from '../websocket/service';
import { WebsocketModule } from '../websocket/gateway';

@Injectable()
export class AppService {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
    private readonly kafkaServer: KafkaService,
    private readonly websocketModule: WebsocketModule,
    private readonly websocketService: WebsocketService,
  ) {}

  findAll(): News[] {
    const news = data;
    return news;
  }

  async sendMessageToKafkaAndBroadcast(message): Promise<void> {
    try {
      await this.kafkaProducer.onModuleInit();
      await this.kafkaProducer.produceMessage(message);

      this.websocketModule.broadcastMessage(message);

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

  async fetchMessageFromKafkaAndBroadcast(): Promise<void> {
    try {
      const message = await this.kafkaServer.getMessage();

      this.websocketService.broadcastMessage(message);

      console.log('Message fetched from Kafka and broadcasted successfully.');
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Error fetching message from Kafka or broadcasting:',
          error.message,
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw new Error('Error fetching message from Kafka or broadcasting.');
    }
  }

  async listenForKafkaMessagesAndBroadcast(): Promise<void> {
    try {
      await this.kafkaServer.onModuleInit();
      await this.kafkaServer.listen((message) => {
        this.websocketModule.broadcastMessage(message);
      });
    } catch (error) {
      console.error('Error listening for Kafka messages:', error);
      throw new Error('Error listening for Kafka messages');
    }
  }
}
