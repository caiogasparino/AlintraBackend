// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app/controllers/app.controller';
import { AppService } from './app/services/app.service';
import { NewsProducer } from './app/kafka/producer';
import { NewsConsumer } from './app/kafka/consumer';
import { WebsocketGateway } from './app/websocket/gateway';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WebsocketService } from './app/websocket/service';

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
    NewsProducer,
    NewsConsumer,
    WebsocketGateway,
    WebsocketService,
  ],
})
export class AppModule {}
