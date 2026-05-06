import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
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
    findAll(name?: string, email?: string, address?: string, role?: string): Promise<{
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
    updatePassword(req: any, dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
