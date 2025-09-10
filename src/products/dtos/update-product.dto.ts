import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, Length, Min, IsOptional } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 150)
    @ApiPropertyOptional({
        description: "product title",
        example: "product title"})
    title?: string
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: "description of product",
        example: "product description"})
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, { message: "price shulde be greter than zero" })
    @ApiPropertyOptional({
        description: "product price",
        example: 1000000})
    price?: number
}