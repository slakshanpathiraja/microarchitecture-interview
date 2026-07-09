import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);

  const config = new DocumentBuilder()
    .setTitle('Authentication Service')
    .setDescription('The Authentication Service API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.port ?? 4001);
}
bootstrap();
