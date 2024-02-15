import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebsocketService } from './app/websocket/service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const websocketService = app.get(WebsocketService);
  websocketService.initialize(app.getHttpServer());

  await app.listen(3000);
}
bootstrap();
