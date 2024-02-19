import { DocumentType } from '@typegoose/typegoose';
import { RentEntity } from './rent.entity.js';
import { CreateRentDto } from './index.js';
import { UpdateRentDto } from './dto/update-rent.dto.js';

export interface RentService {
  create(dto: CreateRentDto): Promise<DocumentType<RentEntity>>;
  updateById(rentId: string, dto: UpdateRentDto): Promise<DocumentType<RentEntity> | null>;
  find(count?: number): Promise<DocumentType<RentEntity>[]>;
  findDescByCreateDTTM(count?: number): Promise<DocumentType<RentEntity>[]>;
  deleteRentById(rentId: string): Promise<DocumentType<RentEntity> | null>;
  findFavoriteRent(count?: number): Promise<DocumentType<RentEntity>[]>;
}
