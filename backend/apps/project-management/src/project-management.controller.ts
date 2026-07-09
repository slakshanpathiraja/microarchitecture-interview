import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProjectManagementService } from './project-management.service';
import { JwtAuthGuard, Authorization, AuthenticatedUser } from '@app/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class ProjectManagementController {
  constructor(private readonly projectManagementService: ProjectManagementService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getHello(@Authorization() user: AuthenticatedUser): string {
    return this.projectManagementService.getHello();
  }
}
