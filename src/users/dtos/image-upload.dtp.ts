import { ApiProperty } from "@nestjs/swagger";

export class ImageUploadDto {
     
    @ApiProperty({type:"string",format:"binary",required:true,name:"profileImage"})
    file: Express.Multer.File

    @ApiProperty({type:"string",format:"binary",required:true,name:"files"})
    files: Express.Multer.File[]
}