import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class forgetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;

}