import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { City } from '../../../types/city.enum.js';
import { RequestBody, ResponseBody } from '../../../lib/rest/index.js';

export type FindPremiumRentsByCityRequestType = Request<{ city: City } | ParamsDictionary, ResponseBody, RequestBody>;
