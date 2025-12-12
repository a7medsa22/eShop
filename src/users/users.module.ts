import { BadRequestException, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { AuthRoleGuard } from './guards/auth-role.guard';
import multer, { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { MailsModule } from '../mails/mails.module';
import { AuthProvider } from './auth.provider';

@Module({
    controllers: [UsersController],
    providers: [UsersService,AuthProvider ,AuthGuard, AuthRoleGuard],
    exports: [UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    global: true,
                    secret: config.get<string>("JWT_SECRET"),
                    signOptions: {
                        expiresIn: config.get<string>('JWT_EXPIRED_IN')
                    }
                }
            }
        }),
        MulterModule.register({
            storage:diskStorage({
              destination:'./image/users',
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
          }),
          
          MailsModule
    ]
})
export class UsersModule { }
