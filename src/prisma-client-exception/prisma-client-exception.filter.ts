import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const msg = exception.message;

    switch (exception.code) {
      case 'P2002':
        res.status(409).json({
          statusCode: 409,
          msg,
        });
        break;

      default:
        super.catch(exception, host);
    }
  }
}
