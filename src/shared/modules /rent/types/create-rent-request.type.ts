import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../lib/rest/index.js';
import { CreateRentDto } from '../index.js';

export type CreateRentRequestType = Request<RequestParams, RequestBody, CreateRentDto>;
