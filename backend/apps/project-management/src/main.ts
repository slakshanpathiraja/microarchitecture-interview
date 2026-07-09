import { NestFactory } from '@nestjs/core';
import { ProjectManagementModule } from './project-management.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProjectManagementModule);

  const config = new DocumentBuilder()
    .setTitle('Project Management Service')
    .setDescription('The Project Management Service API description')
    .setVersion('1.0')
    .addTag('projects')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.port ?? 4002);
}
bootstrap();
