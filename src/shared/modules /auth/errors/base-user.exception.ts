import { HttpError } from '../../../lib/rest/index.js';


export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}
