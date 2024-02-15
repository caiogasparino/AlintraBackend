import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import { data } from '../mock';

@Injectable()
export class NewsProducer {
  private kafka: Kafka;
  private producer: Producer;
  private readonly logger = new Logger(NewsProducer.name);
  private readonly batchSize = 10;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['kafka:9092'],
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async sendMessage(): Promise<void> {
    try {
      await this.producer.connect();

      for (let i = 0; i < data.length; i += this.batchSize) {
        const batch = data.slice(i, i + this.batchSize);

        const messages = batch.map((item) => ({
          value: JSON.stringify(item),
        }));

        await this.producer.send({
          topic: 'news-topic',
          messages,
        });

        this.logger.log(`Sent ${batch.length} news messages to Kafka`);
      }

      await this.producer.disconnect();

      this.logger.log(`All news messages sent to Kafka`);
    } catch (error) {
      this.logger.error('Error sending news to Kafka:', error.stack);
      throw new Error('Error sending news to Kafka');
    }
  }
}
