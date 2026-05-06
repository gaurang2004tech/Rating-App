// src/stores/dto/create-store.dto.ts
import { IsEmail, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateStoreDto {
    @IsString()
    name: string;

    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @Length(1, 400, { message: 'Address must be at most 400 characters' })
    address: string;

    @IsOptional()
    @IsNumber()
    ownerId?: number;
}
