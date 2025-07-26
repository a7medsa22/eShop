import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ReviewService } from "src/reviews/reviews.service";

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => ReviewService))
        private readonly reviewService: ReviewService
    ) { }
    getAll() {
        return [
            { id: 1, name: 'Ahmed' },
            { id: 2, name: 'mohamed' },
        ];
    }
    create() {
        return 'create';
    }
}