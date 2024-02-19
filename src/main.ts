import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebsocketService } from './app/websocket/service';
import { createServer } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressServer = app.getHttpServer();
  const httpServer = createServer(expressServer);
  const websocketService = app.get(WebsocketService);
  websocketService.initialize(httpServer);
  await app.listen(3000);
}
bootstrap();
