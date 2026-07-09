import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AppConfigService } from '@app/common';
import Redis from 'ioredis';

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuditService.name);
  private subClient: Redis;

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly appConfigService: AppConfigService,
  ) {}

  onModuleInit() {
    const host = this.appConfigService.redisHost;
    const port = this.appConfigService.redisPort;
    const password = this.appConfigService.redisPassword;

    this.subClient = new Redis({ host, port, password });

    this.subClient.subscribe('audit_logs', (err) => {
      if (err) {
        this.logger.error('Failed to subscribe to audit_logs channel:', err);
      } else {
        this.logger.log('Subscribed successfully to Redis audit_logs channel');
      }
    });

    this.subClient.on('message', async (channel, message) => {
      if (channel === 'audit_logs') {
        try {
          const data = JSON.parse(message);
          const auditLog = this.auditLogRepository.create({
            userId: data.userId,
            userEmail: data.userEmail,
            action: data.action,
            details: data.details,
            timestamp: new Date(data.timestamp),
          });
          await this.auditLogRepository.save(auditLog);
          this.logger.log(`Audit log recorded: [${data.action}] - ${data.details}`);
        } catch (error) {
          this.logger.error('Failed to process/save audit log message:', error);
        }
      }
    });
  }

  onModuleDestroy() {
    this.subClient?.disconnect();
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { timestamp: 'DESC' },
    });
  }
}
