import { ApiProperty } from "@nestjs/swagger"
import { isNumber, IsNumber, IsString, Length, Max, Min, min } from "class-validator"

export class CreateReviewDto {
    @IsNumber({allowInfinity:false,allowNaN:false,maxDecimalPlaces:2})
    @Min(1)
    @Max(5)
    @ApiProperty({description: 'rating',example: 5})
    rating: number      
    @IsString()
    @Length(3, 200)
    @ApiProperty({description: 'comment',example: 'good'})
    comment: string
}