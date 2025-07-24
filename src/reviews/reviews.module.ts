import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewService } from './reviews.service';

@Module({
    controllers: [ReviewsController],
    providers:[ReviewService]
})
export class ReviewsModule {}
