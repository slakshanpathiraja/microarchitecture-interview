import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RedisModule } from '@app/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    RedisModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule { }
