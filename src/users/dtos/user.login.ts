import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class userLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}