import { Field, Float, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProductInput {
    @Field()
    title: string;
    @Field({ nullable: true })
    description: string;
    @Field(()=>Float)
    price:number
}