import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class userLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({
        example: "example@example.com",
        description: "Email address of the user",
})
    email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({
        example: "password123",
        description: "Password of the user",
})
    password: string;
}