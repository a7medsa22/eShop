import { Controller,Get } from '@nestjs/common';
@Controller({})
export class ReviewsController {
    @Get('api/reviews')
    public getReviews() {
        return [
            {id:1,name:"hamada",rate:4},
            {id:2,name:"Nada",rate:3.5}
        ]
    }
}
