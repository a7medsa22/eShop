import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
controllers:[UploadsController],
imports:[MulterModule.register({
    storage:diskStorage({
      destination:'./image',
      filename:(req,file,cb) =>{
        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`
        const sanitizedName = file.originalname.replace(/\s+/g, '-').toLowerCase();
        const filename = `${prefix}-${sanitizedName}`;
        cb(null,filename);
      }
    }),
    fileFilter:(req,file,cb)=>{
      if(file.mimetype.startsWith('image')) cb(null,true)
      else cb(new BadRequestException('Only image file allowed'),false)
    },
    limits:{fileSize : 1024 * 1024 * 3}
  })]

})
export class UploadsModule {}
