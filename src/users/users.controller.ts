import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserRegisterDto } from './dtos/user.register';
import { userLoginDto } from './dtos/user.login';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/type';
import { AuthGuard } from './guards/auth.guard';
import { UserType } from 'src/users/entities/user.entity';
import { Roles } from './decorators/user-role.decorator';
import { AuthRoleGuard } from './guards/auth-role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // POST  ~/api/user/auth/register
  @Post('auth/register')
  public createRegister(@Body() body: UserRegisterDto) {
    return this.usersService.register(body);
  }

  @Post('auth/login')
  @HttpCode(200)
  public login(@Body() body: userLoginDto) {
    return this.usersService.login(body);
  }
  @Get('profile')
  @UseGuards(AuthGuard)
  public getProfile(@CurrentUser() payload: JwtPayloadType) {
    return this.usersService.getCurrentUser(payload.id)
  }
  // ~/api/users
  @Get('all')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  public getAllUser() {
    return this.usersService.getAllCurrentUser()
  }

  @Post('profile-image')
  @Put('profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImage',{
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
  }))
  public async uploudProfileImage(@UploadedFile()file:Express.Multer.File,@CurrentUser() payload:JwtPayloadType){
    if(!file) throw new BadRequestException('file is required')
    return this.usersService.setprofileImage(payload.id,file.filename)
  };

  @Get("profile-image/:id")
  @UseGuards(AuthGuard)
  public async getProfileImage(@CurrentUser() payload:JwtPayloadType) { 
    return  this.usersService.getProfileImage(payload.id);    
  } 
  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN,UserType.NORMAL_USER)
  @UseGuards(AuthRoleGuard)
  public deleteUser(@CurrentUser() payload:JwtPayloadType) {
    return this.usersService.removeProfileIamge(payload.id);
  }
  
}
