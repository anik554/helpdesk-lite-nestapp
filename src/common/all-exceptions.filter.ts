import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const statusCode = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = isHttp ? exception.getResponse() : 'Internal server error';
    let error: string | undefined;

    if (isHttp) {
      const responseMessage = exception.getResponse();
      if (typeof response === 'string') {
        message = responseMessage;
      } else {
        const objectResponse = responseMessage as {
          message?: string | string[];
          error?: string;
        };
        message = objectResponse.message ?? message;
        error = objectResponse.error;
      }
    }

    if (!isHttp) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      statusCode,
      success: false,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
