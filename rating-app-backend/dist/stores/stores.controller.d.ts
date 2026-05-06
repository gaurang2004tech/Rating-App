import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    create(dto: CreateStoreDto): Promise<import("../entities/store.entity").Store>;
    findAll(req: any, name?: string, email?: string, address?: string): Promise<any[]>;
    getOwnerDashboard(req: any): Promise<{
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
    findOne(id: number): Promise<import("../entities/store.entity").Store>;
}
