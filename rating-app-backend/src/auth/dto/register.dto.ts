// src/auth/dto/register.dto.ts
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
    name: string;

    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
        message: 'Password must contain at least one special character',
    })
    password: string;

    @IsString()
    @Length(1, 400, { message: 'Address must be at most 400 characters' })
    address: string;
}
