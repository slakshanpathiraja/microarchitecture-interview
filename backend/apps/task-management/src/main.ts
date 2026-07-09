import { NestFactory } from '@nestjs/core';
import { TaskManagementModule } from './task-management.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(TaskManagementModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Task Management Service')
    .setDescription('The Task Management Service API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.port ?? 4003);
}
bootstrap();
