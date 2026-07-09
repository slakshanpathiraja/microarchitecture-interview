import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseContent = exception instanceof HttpException
      ? exception.getResponse()
      : null;

    const errorMessage = typeof responseContent === 'object' && responseContent !== null
      ? (responseContent as any).message || responseContent
      : exception.message || 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorMessage,
      data: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
