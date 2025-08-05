import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewService],
    imports: [TypeOrmModule.forFeature([Review])]
})
export class ReviewsModule {}
