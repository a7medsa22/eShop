import { IsString, IsNumber, IsNotEmpty, Length, Min } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    title?: string
    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: "price shulde be greter than zero" })
    price?: number
}