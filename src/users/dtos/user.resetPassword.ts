import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class resetPasswordDto {

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    newPassword: string;
 
    
    @IsNotEmpty()
    @IsString()
    token: string;
}