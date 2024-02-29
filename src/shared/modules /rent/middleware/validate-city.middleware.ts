import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError, Middleware } from '../../../lib/rest/index.js';
import { capitalize, isCity } from '../../../helpers/common.js';


export class ValidateCitydMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const city = req.params[this.param];

    if (city && isCity(capitalize(city))) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${city} not found`,
      'ValidateCitydMiddleware'
    );
  }
}
