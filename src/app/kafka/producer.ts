import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import newsType from 'eventType';
import { data } from '../mock';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private producer: Producer;
  private kafka: Kafka;
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly categories = ['News', 'Release'];

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer({
      metadataMaxAge: 30000,
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
      maxInFlightRequests: 10,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    this.produceData();
    this.scheduleRandomMessage();
  }

  private async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Connected to Kafka successfully');
    } catch (error) {
      this.logger.error('Error connecting to Kafka:', error);
      throw new Error('Error connecting to Kafka');
    }
  }

  private produceData(): void {
    data.forEach(async (news) => {
      const messageBuffer = newsType.toBuffer({
        ...news,
        id: news.id.toString(),
        product_id: news.product_id.toString(),
      });
      try {
        await this.producer.send({
          topic: 'news-topic',
          messages: [
            {
              value: messageBuffer,
              timestamp: Date.now().toString(),
            },
          ],
        });
        this.logger.log('Sent message successfully');
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } catch (error) {
        this.logger.error('Error sending message:', error);
      }
    });
  }

  private scheduleRandomMessage(): void {
    setInterval(() => {
      this.queueRandomMessage();
    }, 3000);
  }

  private getRandomCategory(): string {
    const index = Math.floor(Math.random() * this.categories.length);
    return this.categories[index];
  }

  private getRandomNoise(category: string): string {
    switch (category) {
      case 'News':
        return 'headline';
      case 'Release':
        return 'conversation';
      default:
        return 'silence...';
    }
  }

  async produceMessage(message): Promise<void> {
    try {
      const messageBuffer = newsType.toBuffer({
        ...message,
        id: message.id.toString(),
        product_id: message.product_id.toString(),
      });
      await this.producer.send({
        topic: 'news-topic',
        messages: [
          {
            value: messageBuffer,
            timestamp: Date.now().toString(),
          },
        ],
      });
      console.log('Sent message successfully');
    } catch (error) {
      this.logger.error('Error sending message:', error);
      throw new Error('Error sending message');
    }
  }

  private queueRandomMessage(): void {
    const category = this.getRandomCategory();
    const noise = this.getRandomNoise(category);
    const randomIndex = Math.floor(Math.random() * data.length);
    const news = data[randomIndex];
    if (!news) {
      return;
    }
    const event = {
      id: news.id.toString() || '0',
      type: news.type || 'news',
      title: news.title || 'No title',
      introduction: news.introduction || 'No introduction',
      publication_date: new Date().toISOString() || 'No publication date',
      product_id: news.product_id.toString() || '0',
      products: news.products || 'No products',
      editorial_sections: news.editorial_sections || 'No editorial sections',
      images: news.images || 'No images',
      related_products: news.related_products || 'No related products',
      highlight: news.highlight || false,
      link: news.link || 'No link',
      category,
      noise,
    };
    const messageBuffer = newsType.toBuffer(event);
    this.producer.send({
      topic: 'news-topic',
      messages: [
        {
          value: messageBuffer,
          timestamp: Date.now().toString(),
        },
      ],
    });
    const eventFormatted = JSON.stringify(event, null, 2);
    this.logger.log(`Message queued:\n${eventFormatted}`);
  }
}
