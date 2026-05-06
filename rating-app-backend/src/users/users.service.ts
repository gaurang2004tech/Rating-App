// src/users/users.service.ts
import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
    ) { }

    async create(dto: CreateUserDto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({ ...dto, password: hashed });
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }

    async findAll(filters: { name?: string; email?: string; address?: string; role?: string }) {
        const where: any = {};
        if (filters.name) where.name = ILike(`%${filters.name}%`);
        if (filters.email) where.email = ILike(`%${filters.email}%`);
        if (filters.address) where.address = ILike(`%${filters.address}%`);
        if (filters.role) where.role = filters.role;

        const users = await this.userRepository.find({ where });
        return users.map(({ password, ...u }) => u);
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        const { password, ...userData } = user;
        const result: any = { ...userData };

        if (user.role === UserRole.STORE_OWNER) {
            // find the store owned by this user and compute its avg rating
            const avgResult = await this.ratingRepository
                .createQueryBuilder('r')
                .innerJoin('r.store', 's')
                .where('s.ownerId = :id', { id })
                .select('AVG(r.value)', 'avg')
                .getRawOne();
            result.storeRating = avgResult?.avg ? parseFloat(avgResult.avg).toFixed(1) : null;
        }
        return result;
    }

    async updatePassword(id: number, dto: UpdatePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepository.save(user);
        return { message: 'Password updated successfully' };
    }

    async getStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { role: UserRole.STORE_OWNER } }),
            this.ratingRepository.count(),
        ]);
        return { totalUsers, totalStores, totalRatings };
    }
}
