import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Rating } from '../entities/rating.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly ratingRepository;
    constructor(userRepository: Repository<User>, ratingRepository: Repository<Rating>);
    create(dto: CreateUserDto): Promise<{
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
    findAll(filters: {
        name?: string;
        email?: string;
        address?: string;
        role?: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        ratings: any[];
        stores: any[];
    }[]>;
    findOne(id: number): Promise<any>;
    updatePassword(id: number, dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
