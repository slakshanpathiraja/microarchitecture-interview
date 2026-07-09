import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard, AuthorizationGuard, Authorize, UserRole, Authorization, AuthenticatedUser } from '@app/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(@Authorization() user: AuthenticatedUser): string {
    return 'Audit service is online';
  }

  @Get('logs')
  @ApiTags('admin')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Authorize(UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all audit logs (Admin only)' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing access token.' })
  @ApiResponse({ status: 403, description: 'Access denied: administrator role required.' })
  async getLogs() {
    return this.auditService.getAuditLogs();
  }
}
