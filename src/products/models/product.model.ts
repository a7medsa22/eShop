import { Review } from "src/reviews/entities/review.entity";
import { User } from "src/users/entities/user.entity";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProductType {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;
    
    @Field()
    description: string;

    @Field(() => Float)
    price: number;

    @Field()
    createAt: Date;

    @Field()
    updateAt: Date;

    @Field(() => [Review], { nullable: true })
    reviews: Review[];

    @Field(() => [Review], { nullable: true })
    user: User
}