import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor, HttpExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuditModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Audit Logging Service')
    .setDescription('The Audit Logging Service API')
    .setVersion('1.0')
    .addTag('audit')
    .addServer('http://localhost:4000/audit', 'Gateway')
    .addServer('http://localhost:4005', 'Direct (Without Gateway)')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('AUDIT_PORT') ?? 4005);
}
bootstrap();
