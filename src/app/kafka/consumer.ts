import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class NewsConsumer {
  private consumer: Consumer;
  private readonly logger = new Logger(NewsConsumer.name);

  constructor() {
    this.consumer = new Kafka({
      clientId: 'alintra-app',
      brokers: ['kafka:9092'],
    }).consumer({ groupId: 'news-group' });
  }

  async initialize(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: 'news-topic' });
      this.logger.log('Consumer initialized and subscribed to news-topic');
    } catch (error) {
      this.logger.error('Error initializing consumer:', error.stack);
      throw new Error('Error initializing consumer');
    }
  }

  async listen(callback: (message: string) => void): Promise<void> {
    try {
      await this.initialize();

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          callback(message.value.toString());
        },
      });
    } catch (error) {
      this.logger.error('Error listening for news messages:', error.stack);
      throw new Error('Error listening for news messages');
    }
  }
}
