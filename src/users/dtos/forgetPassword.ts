import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class forgetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ example: "example@gmail.com" })
    @IsString({ message: "Email must be a string" })
    @MinLength(1, { message: "Email must be at least 1 character long" })
    email: string;

}