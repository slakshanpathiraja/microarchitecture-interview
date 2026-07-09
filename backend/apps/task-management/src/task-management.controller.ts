import { Controller, Get, UseGuards } from '@nestjs/common';
import { TaskManagementService } from './task-management.service';
import { JwtAuthGuard, Authorization, AuthenticatedUser } from '@app/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class TaskManagementController {
  constructor(private readonly taskManagementService: TaskManagementService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getHello(@Authorization() user: AuthenticatedUser): string {
    return this.taskManagementService.getHello();
  }
}
