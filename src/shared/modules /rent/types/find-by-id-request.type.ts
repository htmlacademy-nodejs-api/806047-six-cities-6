import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export type ParamRentId = { rentId: string } | ParamsDictionary;

export type FindByIdRentRequestType = Request<ParamRentId>
