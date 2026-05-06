import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Store } from '../entities/store.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
export declare class RatingsService {
    private readonly ratingRepository;
    private readonly storeRepository;
    constructor(ratingRepository: Repository<Rating>, storeRepository: Repository<Store>);
    submitOrUpdateRating(userId: number, dto: SubmitRatingDto): Promise<{
        message: string;
        rating: Rating;
    }>;
}
