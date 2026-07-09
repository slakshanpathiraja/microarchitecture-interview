import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '@app/db';
import { AuditActionType } from '../enums/audit-action-type.enum';
import { AUDIT_LOG_KEY, AuditLogOptions } from '../decorators/audit-log.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<AuditLogOptions>(AUDIT_LOG_KEY, context.getHandler());
    if (!options) {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const user = request.user;
          let userId = user?.sub || null;
          let userEmail = user?.email || null;

          // If it's a login action, we can capture the user info from the response data
          if (options.action === AuditActionType.LOGIN && response) {
            userId = response.user?.id || userId;
            userEmail = response.user?.email || userEmail;
          }

          let details = '';
          if (typeof options.details === 'function') {
            details = options.details(request, response);
          } else if (typeof options.details === 'string') {
            details = options.details;
          } else {
            details = `${request.method} ${request.route?.path || request.url}`;
          }

          const logPayload = {
            userId,
            userEmail,
            action: options.action,
            details,
            timestamp: new Date().toISOString(),
          };

          await this.redisService.publish('audit_logs', JSON.stringify(logPayload));
        } catch (error) {
          console.error('AuditInterceptor failed to record audit log:', error);
        }
      }),
    );
  }
}
