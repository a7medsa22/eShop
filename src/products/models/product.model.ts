import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Review } from "src/reviews/entities/review.entity";
import { current_TimeStamp } from "src/utils/constrant";
import { User } from "src/users/entities/user.entity";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Product {
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