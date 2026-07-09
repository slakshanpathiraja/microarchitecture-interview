import { Module } from '@nestjs/common';
import { ProjectManagementController } from './project-management.controller';
import { ProjectManagementService } from './project-management.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RedisModule } from '@app/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
  ],
  controllers: [ProjectManagementController],
  providers: [ProjectManagementService],
})
export class ProjectManagementModule {}
