import { Request } from 'express';
import { ParamRentId } from '../../rent/index.js';

export type FindCommentsRequest = Request<ParamRentId>
