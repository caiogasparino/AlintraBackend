// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app/controllers/app.controller';
import { AppService } from './app/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WebsocketService } from './app/websocket/service';
import { KafkaService } from './app/kafka/consumer';
import { KafkaProducerService } from './app/kafka/producer';
import { WebsocketModule } from './app/websocket/gateway';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaService,
    KafkaProducerService,
    WebsocketService,
    WebsocketModule,
  ],
})
export class AppModule {}
