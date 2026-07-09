import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Notifications Service')
    .setDescription('The Notifications Service API description')
    .setVersion('1.0')
    .addTag('notifications')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.port ?? 4004);
}
bootstrap();

