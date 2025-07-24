import { Controller,Get } from '@nestjs/common';
import { ReviewService } from './reviews.service';
@Controller('api/reviews')
export class ReviewsController {
    constructor(private reviewService:ReviewService){}
    @Get()
    public getReviews() {
        return this.reviewService.getAll();
    }
}
