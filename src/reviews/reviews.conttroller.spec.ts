import { Test } from "@nestjs/testing";
import { ReviewsController } from "./reviews.controller";
import { ReviewService } from "./reviews.service";

describe('ReviewsController', () => {
    let reviewsController: ReviewsController;
    let reviewsService: ReviewService;
    
    beforeEach(async()=>{
        const moduleRef = await Test.createTestingModule({
            controllers:[ReviewsController],
            providers:[ReviewService],
        }).compile();
        reviewsService = moduleRef.get(ReviewService);
        reviewsController = moduleRef.get(ReviewsController);
    })

    describe('findAll',()=>{
        it('should return an array of reviews', async()=>{
            const result =['test']
            jest.spyOn(reviewsService,'getAll').mockImplementation(()=>result);
            expect(await reviewsController.getAllReviews(1,10)).toBe(result);

            
    
    }),

});
});
    