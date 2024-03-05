import { DocumentType } from '@typegoose/typegoose';
import { RentEntity } from './rent.entity.js';
import { CreateRentDto } from './index.js';
import { UpdateRentDto } from './dto/update-rent.dto.js';
import { City } from '../../types/city.enum.js';

export interface RentService {
  create(dto: CreateRentDto): Promise<DocumentType<RentEntity>>;
  updateById(rentId: string, dto: UpdateRentDto): Promise<DocumentType<RentEntity> | null>;
  find(count?: number): Promise<DocumentType<RentEntity>[]>;
  findById(rentId: string): Promise<DocumentType<RentEntity> | null>;
  findDescByCreateDTTM(count?: number): Promise<DocumentType<RentEntity>[]>;
  deleteRentById(rentId: string): Promise<DocumentType<RentEntity> | null>;
  findFavoriteRent(count?: number): Promise<DocumentType<RentEntity>[]>;
  findPremiumRentsByCity(city: City): Promise<DocumentType<RentEntity>[]>
  exists(rentId: string): Promise<boolean>;
  updateCommentsCountAndRaiting(rendId: string, rating: number): Promise<DocumentType<RentEntity> | null>
}
