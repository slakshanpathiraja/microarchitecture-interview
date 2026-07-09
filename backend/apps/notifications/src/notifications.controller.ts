import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard, Authorization, AuthenticatedUser } from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(@Authorization() user: AuthenticatedUser): string {
    return this.notificationsService.getHello();
  }
}
