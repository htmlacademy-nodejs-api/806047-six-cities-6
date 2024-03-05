import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { Component } from '../../types/index.js';

import { BaseUserException } from './errors/index.js';
import { Logger } from '../../lib/logger/index.js';
import { ExceptionFilter } from '../../lib/rest/index.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
