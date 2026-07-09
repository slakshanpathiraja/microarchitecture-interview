import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { DatabaseModule, RedisModule } from '@app/db';
import { CommonConfigModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    CommonConfigModule,
    DatabaseModule,
    RedisModule,
    TypeOrmModule.forFeature([AuditLog]),
  ],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
