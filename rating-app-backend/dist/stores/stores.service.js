"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("../entities/store.entity");
const rating_entity_1 = require("../entities/rating.entity");
let StoresService = class StoresService {
    storeRepository;
    ratingRepository;
    constructor(storeRepository, ratingRepository) {
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;
    }
    async create(dto) {
        const existing = await this.storeRepository.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Store email already in use');
        const store = this.storeRepository.create(dto);
        return this.storeRepository.save(store);
    }
    async findAll(filters, userId) {
        const qb = this.storeRepository
            .createQueryBuilder('store')
            .leftJoin('ratings', 'r', 'r.storeId = store.id')
            .select([
            'store.id as id',
            'store.name as name',
            'store.email as email',
            'store.address as address',
            'ROUND(AVG(r.value), 1) as "averageRating"',
        ])
            .groupBy('store.id');
        if (filters.name)
            qb.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
        if (filters.email)
            qb.andWhere('store.email ILIKE :email', { email: `%${filters.email}%` });
        if (filters.address)
            qb.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });
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
    async findOne(id) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        return store;
    }
    async getOwnerDashboard(ownerId) {
        const store = await this.storeRepository.findOne({ where: { ownerId } });
        if (!store)
            return { store: null, averageRating: null, raters: [] };
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
        const avg = ratings.length > 0
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
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map