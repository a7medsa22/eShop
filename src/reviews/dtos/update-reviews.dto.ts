import { isNumber, IsNumber, IsOptional, IsString, Length, Max, Min, min } from "class-validator"

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber({allowInfinity:false,allowNaN:false,maxDecimalPlaces:2})
    @Min(1)
    @Max(5)
    rating?: number
    
    @IsOptional()
    @IsString()
    @Length(3, 200)
    comment?: string
}