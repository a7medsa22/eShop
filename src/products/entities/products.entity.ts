import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Review } from "src/reviews/entities/review.entity";
import { current_TimeStamp } from "src/utils/constrant";
import { User } from "src/users/entities/user.entity";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({ name: 'products' })
export class Product {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
    @Field()
    @Column({ type: 'varchar', length: 150 })
    title: string;
    @Field()
    @Column()
    description: string;

    @Field(() => Float)
    @Column({ type: 'float' })
    price: number;

    @Field()
    @CreateDateColumn({ type: 'timestamp', default: () => current_TimeStamp })
    createAt: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp', default: () => current_TimeStamp, onUpdate: current_TimeStamp })
    updateAt: Date;

    @Field(() => [Review], { nullable: true })
    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];

    @Field(() => [Review], { nullable: true })
    @ManyToOne(() => User, (user) => user.products)
    user: User
}