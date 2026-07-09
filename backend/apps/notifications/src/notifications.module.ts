import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { RedisModule } from '@app/db';
import { CommonConfigModule } from '@app/common';

@Module({
  imports: [
    CommonConfigModule,
    RedisModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule { }
