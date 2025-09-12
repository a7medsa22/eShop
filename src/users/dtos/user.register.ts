import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserRegisterDto {
    @IsOptional()
    @IsString()
    @MaxLength(150)
    @ApiProperty({type: String,description: 'Username',example: "Ahmed salah" })
    username: string;
    @IsEmail()
    @MaxLength(150)
    @IsNotEmpty()
    @ApiProperty({ type: String,example: "ahmed@gmail.com" ,description: 'Email' })
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({type: String,example: "123456" ,description: 'Password' })
    password: string;
}