import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor, HttpExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Authentication Service')
    .setDescription('The Authentication Service API description')
    .setVersion('1.0')
    .addTag('auth')
    .addServer('http://localhost:4000/authentication', 'Gateway')
    .addServer('http://localhost:4001', 'Direct (Without Gateway)')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.port ?? 4001);
}
bootstrap();
