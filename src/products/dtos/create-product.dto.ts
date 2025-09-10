import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, Length,Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @ApiProperty({
        type: String,
        description: 'title of the product',
        example: 'product title'})
    title: string
    
    @IsString()
    @IsNotEmpty()
     @ApiProperty({
        type: String,
        description: 'description of the product',
        example: 'product description is here'})
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0,{message:"price shulde be greter than zero"})
    @ApiProperty({
        type: Number,
        description: 'price of the product',
        example: 'product price'})
    price: number
}