// src/ratings/ratings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Store } from '../entities/store.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';

@Injectable()
export class RatingsService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
    ) { }

    async submitOrUpdateRating(userId: number, dto: SubmitRatingDto) {
        const store = await this.storeRepository.findOne({ where: { id: dto.storeId } });
        if (!store) throw new NotFoundException('Store not found');

        let rating = await this.ratingRepository.findOne({
            where: { userId, storeId: dto.storeId },
        });

        if (rating) {
            rating.value = dto.value;
        } else {
            rating = this.ratingRepository.create({
                userId,
                storeId: dto.storeId,
                value: dto.value,
            });
        }

        await this.ratingRepository.save(rating);
        return { message: 'Rating submitted successfully', rating };
    }
}
