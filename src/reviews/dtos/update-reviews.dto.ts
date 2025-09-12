import { ApiProperty } from "@nestjs/swagger"
import { isNumber, IsNumber, IsOptional, IsString, Length, Max, Min, min } from "class-validator"

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber({allowInfinity:false,allowNaN:false,maxDecimalPlaces:2})
    @Min(1)
    @Max(5)
    @ApiProperty({description: 'rating',required:false,example: 4.5})
    rating?: number
    
    @IsOptional()
    @IsString()
    @Length(3, 200)
    @ApiProperty({description: 'comment',required:false,example: 'Great product!'})
    comment?: string
}