import { Module } from '@nestjs/common';
import { TaskManagementController } from './task-management.controller';
import { TaskManagementService } from './task-management.service';
import { DatabaseModule, RedisModule } from '@app/db';
import { CommonConfigModule, AuditInterceptor } from '@app/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    CommonConfigModule,
    DatabaseModule,
    RedisModule,
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TaskManagementController],
  providers: [
    TaskManagementService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class TaskManagementModule {}
