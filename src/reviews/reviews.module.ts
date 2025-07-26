import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewService],
    exports: [ReviewService],
    imports: [forwardRef(() => UsersModule)]
})
export class ReviewsModule {}
