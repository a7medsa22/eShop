import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsModule } from 'src/products/products.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewService],
    imports: [TypeOrmModule.forFeature([Review]), UsersModule, ProductsModule, JwtModule],
    exports: [ReviewService]
})
export class ReviewsModule { }
