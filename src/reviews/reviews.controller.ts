import { Controller,Get } from '@nestjs/common';
import { ReviewService } from './reviews.service';
@Controller({})
export class ReviewsController {
    constructor(private reviewService:ReviewService){}
    @Get('api/reviews')
    public getReviews() {
        return this.reviewService.getAll();
    }
}
