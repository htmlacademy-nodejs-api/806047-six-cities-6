import { Request } from 'express';
import { RequestParams, ResponseBody } from '../../../lib/rest/index.js';

export type FindAllRentsRequestType = Request<RequestParams, ResponseBody, { amount?: number }>
