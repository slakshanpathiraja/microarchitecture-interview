import { SetMetadata } from '@nestjs/common';
import { AuditActionType } from '../enums/audit-action-type.enum';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogOptions {
  action: AuditActionType;
  details?: string | ((req: any, res: any) => string);
}

export const AuditLog = (options: AuditLogOptions) => SetMetadata(AUDIT_LOG_KEY, options);
