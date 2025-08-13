import { isNumber, IsNumber, IsString, Length, Max, Min, min } from "class-validator"

export class CreateReviewDto {
    @IsNumber({allowInfinity:false,allowNaN:false,maxDecimalPlaces:2})
    @Min(1)
    @Max(5)
    rating: number
    @IsString()
    @Length(3, 200)
    comment: string
}