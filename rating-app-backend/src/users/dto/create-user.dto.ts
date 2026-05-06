// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
    @IsString()
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

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
