import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-reviews.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/utils/type';
import { AuthGuard } from '../users/guards/auth.guard';
import { Roles } from '../users/decorators/user-role.decorator';
import { AuthRoleGuard } from '../users/guards/auth-role.guard';
import { UserType } from '../users/entities/user.entity';
import { UpdateReviewDto } from './dtos/update-reviews.dto';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('api/reviews')
export class ReviewsController {
    constructor(private reviewService: ReviewService) { }

    @Post('/:id')
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Create a new review' })
    @ApiResponse({ status: 201 ,description: 'Returns the created review' })
    public createNewReview(@Param('id', ParseIntPipe) productId: number, @Body() body: CreateReviewDto, @CurrentUser() payload: JwtPayloadType) {
        return this.reviewService.createOne(productId, payload.id, body);
    }
    @Get()
    @UseGuards(AuthRoleGuard)
    @Roles(UserType.ADMIN)
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Get all reviews' })
    @ApiResponse({ status: 200 ,description: 'Returns all reviews' })
    public getAllReviews(
        @Query('page') page: number = 1 ,
        @Query('limit') limit = 10,
    ){
        return this.reviewService.getAll(page ,limit)
    }
    @Put('/:id')
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Update a review' })
    @ApiResponse({ status: 200 ,description: 'Returns the updated review' })
    public updateReview(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateReviewDto, @CurrentUser() payload: JwtPayloadType) {
        return this.reviewService.updateOne(id, payload.id, body);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard)
    @Roles(UserType.ADMIN, UserType.NORMAL_USER)
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Delete a review' })
    @ApiResponse({ status: 200 ,description: 'Returns the deleted review' })
    public deleteReview(@Param('id', ParseIntPipe) id: number, @CurrentUser() payload: JwtPayloadType) {
        return this.reviewService.deleteOne(id, payload);
    }
}
