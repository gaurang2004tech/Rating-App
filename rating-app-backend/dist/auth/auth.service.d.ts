import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        id: number;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        ratings: any[];
        stores: any[];
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            address: string;
            role: UserRole;
            createdAt: Date;
            updatedAt: Date;
            ratings: any[];
            stores: any[];
        };
    }>;
}
