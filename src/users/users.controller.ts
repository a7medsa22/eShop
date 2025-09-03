import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { get } from 'http';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';
import { forgetPasswordDto } from './dtos/forgetPassword';
import { resetPasswordDto } from './dtos/user.resetPassword';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
            private authProvider:AuthProvider,
            private config:ConfigService
    
  ) { }

  // POST  ~/api/user/auth/register
  @Post('auth/register')
  public createRegister(@Body() body: UserRegisterDto) {
    return this.authProvider.register(body);
  }

  @Post('auth/login')
  @HttpCode(200)
  public login(@Body() body: userLoginDto) {
    return this.authProvider.login(body);
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
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
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
  //~users/verify/:userid/verificationToken`

  @Get("verify/:id/:verificationToken")
  public verify(@Param('id',ParseIntPipe)id:number,@Param('verificationToken')verifyToken:string) {
    return this.authProvider.verifyEmail(id,verifyToken);
  }

  @Post('forget-password')
  public forgotPassword(@Body() body:forgetPasswordDto){
    return this.authProvider.sendResetPasswordLink(body.email);
  }

 @Get("reset-password/:token")
  public getResetPassword(@Param('token')token:string)
   {
    return this.authProvider.validateResetToken(token);
  }

  @Post('reset-password')
  public resetPassword(@Body() body:resetPasswordDto){
    return this.authProvider.resetPassword(body.token,body.newPassword);
  }

  

  
}
