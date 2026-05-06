// src/stores/stores.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
    ) { }

    async create(dto: CreateStoreDto) {
        const existing = await this.storeRepository.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Store email already in use');

        const store = this.storeRepository.create(dto);
        return this.storeRepository.save(store);
    }

    async findAll(filters: { name?: string; email?: string; address?: string }, userId?: number) {
        const qb = this.storeRepository
            .createQueryBuilder('store')
            .leftJoin(
                'ratings',
                'r',
                'r.storeId = store.id',
            )
            .select([
                'store.id as id',
                'store.name as name',
                'store.email as email',
                'store.address as address',
                'ROUND(AVG(r.value), 1) as "averageRating"',
            ])
            .groupBy('store.id');

        if (filters.name) qb.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
        if (filters.email) qb.andWhere('store.email ILIKE :email', { email: `%${filters.email}%` });
        if (filters.address) qb.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });

        const stores = await qb.getRawMany();

        if (userId) {
            const userRatings = await this.ratingRepository.find({
                where: { userId },
                select: ['storeId', 'value'],
            });
            const ratingMap = new Map(userRatings.map((r) => [r.storeId, r.value]));
            return stores.map((s) => ({
                ...s,
                userRating: ratingMap.get(parseInt(s.id)) ?? null,
            }));
        }

        return stores;
    }

    async findOne(id: number) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) throw new NotFoundException('Store not found');
        return store;
    }

    async getOwnerDashboard(ownerId: number) {
        const store = await this.storeRepository.findOne({ where: { ownerId } });
        if (!store) return { store: null, averageRating: null, raters: [] };

        const ratings = await this.ratingRepository
            .createQueryBuilder('r')
            .innerJoinAndSelect('r.user', 'u')
            .where('r.storeId = :storeId', { storeId: store.id })
            .select([
                'r.id',
                'r.value',
                'r.updatedAt',
                'u.id',
                'u.name',
                'u.email',
            ])
            .getMany();

        const avg =
            ratings.length > 0
                ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
                : null;

        return {
            store: { id: store.id, name: store.name, address: store.address, email: store.email },
            averageRating: avg,
            raters: ratings.map((r) => ({
                ratingId: r.id,
                value: r.value,
                updatedAt: r.updatedAt,
                user: r.user,
            })),
        };
    }
}
