// src/ratings/ratings.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) { }

    @Post()
    @Roles(UserRole.USER) // Only normal users can rate
    submitRating(@Request() req: any, @Body() dto: SubmitRatingDto) {
        return this.ratingsService.submitOrUpdateRating(req.user.id, dto);
    }
}
