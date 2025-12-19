import { BadRequestException, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ImageUploadDto } from "../users/dtos/image-upload.dtp";


@Controller('api/uploads')
export class UploadsController {
  constructor() {}
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({type:ImageUploadDto, description:'Multiple files',required:true,})
  public async uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File> ) {
    if(!files || files.length === 0){
        throw new BadRequestException('No files uploaded');
    }
    return { message: 'Files uploaded successfully'}
  

  }
}