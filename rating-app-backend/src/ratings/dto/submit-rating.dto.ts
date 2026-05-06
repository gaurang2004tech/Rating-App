// src/ratings/dto/submit-rating.dto.ts
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class SubmitRatingDto {
    @IsNumber()
    storeId: number;

    @IsInt()
    @Min(1)
    @Max(5)
    value: number;
}
