// src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    password: string;
}
