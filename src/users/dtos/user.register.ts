import { IsEmail, IsOptional, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserRegisterDto {
    @IsOptional()
    @IsString()
    @MaxLength(150)
    username: string;
    @IsEmail()
    @MaxLength(150)
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}