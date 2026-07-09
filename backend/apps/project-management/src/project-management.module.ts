import { Module } from '@nestjs/common';
import { ProjectManagementController } from './project-management.controller';
import { ProjectManagementService } from './project-management.service';
import { DatabaseModule, RedisModule } from '@app/db';
import { CommonConfigModule, AuditInterceptor } from '@app/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CommonConfigModule,
    DatabaseModule,
    RedisModule,
  ],
  controllers: [ProjectManagementController],
  providers: [
    ProjectManagementService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class ProjectManagementModule {}
