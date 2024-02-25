import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../lib/rest/index.js';
import { UpdateRentDto } from '../dto/update-rent.dto.js';

export type UpdateRentRequestType = Request<RequestParams, RequestBody, UpdateRentDto>;
