import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor() {
    this.consumer = new Kafka({
      brokers: ['127.0.0.1:9092' || 'kafka:9092'],
    }).consumer({
      groupId: 'kafka',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.consumer.connect();
      this.consumer.subscribe({ topic: 'news-topic', fromBeginning: true });

      this.consumer.on(this.consumer.events.CRASH, this.handleError.bind(this));
      this.consumer.on(
        this.consumer.events.DISCONNECT,
        this.handleConsumerReady.bind(this),
      );
      this.consumer.on(this.consumer.events.FETCH, this.handleData.bind(this));

      this.logger.log('Consumer initialized and subscribed to NEWS TOPIC');
    } catch (error) {
      this.logger.error('Error initializing consumer:', error);
      throw new Error('Error initializing consumer');
    }
  }

  private handleConsumerReady(): void {
    console.log('Consumer ready..');
  }

  private handleData(data): void {
    console.log(`Received message: ${JSON.stringify(data)}`);
  }

  private handleError(error: Error): void {
    this.logger.error('Error consuming messages:', error);
    throw new Error('Error consuming messages');
  }

  async listen(callback: (message: string) => void): Promise<void> {
    try {
      await this.initialize();

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            callback(message.value.toString());
          } catch (error) {
            this.logger.error('Error processing message:', error);
          }
        },
      });
    } catch (error) {
      this.logger.error('Error listening for news messages:', error.stack);
      throw new Error('Error listening for news messages');
    }
  }

  async getMessage(): Promise<string> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: 'news-topic',
        fromBeginning: true,
      });

      let message: string = '';

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          message = payload.message.value.toString();
        },
      });

      return message;
    } catch (error) {
      console.error('Error fetching message from Kafka:', error);
      throw new Error('Error fetching message from Kafka');
    }
  }
}
