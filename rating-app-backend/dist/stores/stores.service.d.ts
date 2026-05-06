import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresService {
    private readonly storeRepository;
    private readonly ratingRepository;
    constructor(storeRepository: Repository<Store>, ratingRepository: Repository<Rating>);
    create(dto: CreateStoreDto): Promise<Store>;
    findAll(filters: {
        name?: string;
        email?: string;
        address?: string;
    }, userId?: number): Promise<any[]>;
    findOne(id: number): Promise<Store>;
    getOwnerDashboard(ownerId: number): Promise<{
        store: null;
        averageRating: null;
        raters: never[];
    } | {
        store: {
            id: number;
            name: string;
            address: string;
            email: string;
        };
        averageRating: string | null;
        raters: {
            ratingId: number;
            value: number;
            updatedAt: Date;
            user: any;
        }[];
    }>;
}
