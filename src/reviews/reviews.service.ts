import { Injectable, Inject, forwardRef, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { CreateReviewDto } from './dtos/create-reviews.dto';
import { JwtPayloadType } from 'src/utils/type';
import { UpdateReviewDto } from './dtos/update-reviews.dto';
import { UserType } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  public async createOne(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ) {
    const product = await this.productsService.getOne(productId);
    const user = await this.usersService.getCurrentUser(userId);

    const review = await this.reviewRepository.create({
      ...dto,
      user,
      product,
    });
    const result = await this.reviewRepository.save(review);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      product: [result.product.id, result.product.title],
      user: [result.user.id, result.user.username],
      createdAt: result.createAt,
      updatedAt: result.updateAt,
    };
  }
  /**
   * Retrieves all reviews from the database.
   *  @param pageNumber 
   * @param pageSize 
   * @description This method retrieves all reviews from the database.
   * @returns  service that returns all reviews
   */
  public getAll(pageNumber:number,pageSize:number) {
    return this.reviewRepository.find({
      skip: pageSize * (pageNumber - 1) || 0, 
      take: pageSize  || 10,
      order:{createAt :'DESC'}})
  };
  /**
   *  Updates a review by its ID.
   * @param id 
   * @param userId
   * @param dto
   * @description This method updates the rating and comment of a review.
   * It checks if the review exists and if the user is authorized to update it.
    * @returns The updated review.
   */
  public async updateOne(id:number,userId:number,dto:UpdateReviewDto){
    const review = await this.getOne(id);

    if(review.user.id !== userId) {
      throw new ForbiddenException("you are not allowed to update this review");
    }
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;

    return this.reviewRepository.save(review);
  }
  /**
   *  Deletes a review by its ID.
   * @description This method checks if the review exists and if the user is authorized to delete
   * @param id 
   * @param payload 
   * @returns  A message indicating that the review has been deleted.
   */
  public  async deleteOne(id:number,payload:JwtPayloadType){
   const review = await this.getOne(id);
   if(review.user.id === payload.id || payload.userType === UserType.ADMIN)
    {
         await this.reviewRepository.remove(review);
    return {message:"review has been deleted"}
} 
  throw new ForbiddenException("you are not allowed");
   }
/**
 *  Retrieves a review by its ID.
 * @param id 
 * @returns  The review with the specified ID.
 */
private async getOne(id:number){
 const review = await this.reviewRepository.findOne({where:{id},relations: ['user', 'product'],});
 if(!review)  throw new NotFoundException("product Not found");
 return review;
}

}
