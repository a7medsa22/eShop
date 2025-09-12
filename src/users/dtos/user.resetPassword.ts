import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class resetPasswordDto {

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        example: "123456",
        description: "Password",
        type: "string",
        required: true,
    })
    newPassword: string;
 
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "emxkcmdkfkmcvflkvf",
        description: "Token",
        type: "string",
        required: true,
    })
    token: string;
}