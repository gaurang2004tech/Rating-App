"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../entities/user.entity");
const rating_entity_1 = require("../entities/rating.entity");
let UsersService = class UsersService {
    userRepository;
    ratingRepository;
    constructor(userRepository, ratingRepository) {
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
    }
    async create(dto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({ ...dto, password: hashed });
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }
    async findAll(filters) {
        const where = {};
        if (filters.name)
            where.name = (0, typeorm_2.ILike)(`%${filters.name}%`);
        if (filters.email)
            where.email = (0, typeorm_2.ILike)(`%${filters.email}%`);
        if (filters.address)
            where.address = (0, typeorm_2.ILike)(`%${filters.address}%`);
        if (filters.role)
            where.role = filters.role;
        const users = await this.userRepository.find({ where });
        return users.map(({ password, ...u }) => u);
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { password, ...userData } = user;
        const result = { ...userData };
        if (user.role === user_entity_1.UserRole.STORE_OWNER) {
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
    async updatePassword(id, dto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepository.save(user);
        return { message: 'Password updated successfully' };
    }
    async getStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { role: user_entity_1.UserRole.STORE_OWNER } }),
            this.ratingRepository.count(),
        ]);
        return { totalUsers, totalStores, totalRatings };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map