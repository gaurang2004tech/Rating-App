import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    submitRating(req: any, dto: SubmitRatingDto): Promise<{
        message: string;
        rating: import("../entities/rating.entity").Rating;
    }>;
}
