import { IsString, IsNumber, IsNotEmpty, Length,Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    title: string
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0,{message:"price shulde be greter than zero"})
    price: number
}