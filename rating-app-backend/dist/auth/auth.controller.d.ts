import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: number;
        name: string;
        email: string;
        address: string;
        role: import("../entities/user.entity").UserRole;
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
            role: import("../entities/user.entity").UserRole;
            createdAt: Date;
            updatedAt: Date;
            ratings: any[];
            stores: any[];
        };
    }>;
}
