import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const { message, code } = exception;
    const response = host.switchToHttp().getResponse<Response>();

    console.error(message);
    console.error(code);

    switch (code) {
      case 'P2002': {
        const statusCode = HttpStatus.CONFLICT;
        this.sendResponse(response, statusCode, message);

        break;
      }
      case 'P2025': {
        const statusCode = HttpStatus.NOT_FOUND;
        this.sendResponse(response, statusCode, message);

        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }

  sendResponse(response, statusCode, message) {
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
