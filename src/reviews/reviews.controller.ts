import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-reviews.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/utils/type';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { AuthRoleGuard } from 'src/users/guards/auth-role.guard';
import { UserType } from 'src/users/entities/user.entity';
import { UpdateReviewDto } from './dtos/update-reviews.dto';
@Controller('api/reviews')
export class ReviewsController {
    constructor(private reviewService: ReviewService) { }

    @Post('/:id')
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public createNewReview(@Param('id', ParseIntPipe) productId: number, @Body() body: CreateReviewDto, @CurrentUser() payload: JwtPayloadType) {
        return this.reviewService.createOne(productId, payload.id, body);
    }
    @Get()
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN)
    public getAllReviews(
        @Query('page') page: number = 1 ,
        @Query('limit') limit = 10,
    ){
        return this.reviewService.getAll(page ,limit)
    }
    @Put('/:id')
    @UseGuards(AuthGuard)
    public updateReview(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateReviewDto, @CurrentUser() payload: JwtPayloadType) {
        return this.reviewService.updateOne(id, payload.id, body);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    public deleteReview(@Param('id', ParseIntPipe) id: number, @CurrentUser() payload: JwtPayloadType) {
        return this.reviewService.deleteOne(id, payload);
    }
}
