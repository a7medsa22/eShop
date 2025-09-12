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
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';
import { forgetPasswordDto } from './dtos/forgetPassword';
import { resetPasswordDto } from './dtos/user.resetPassword';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ImageUploadDto } from './dtos/image-upload.dtp';
import { throttle } from 'rxjs';
import { Throttle } from '@nestjs/throttler';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
            private authProvider:AuthProvider,
            private config:ConfigService
    
  ) { }

  // POST  ~/api/user/auth/register
  @Post('auth/register')
  @ApiOperation({ description: 'Register a new user' })
  
  public createRegister(@Body() body: UserRegisterDto) {
    return this.authProvider.register(body);
  }

  @Post('auth/login')
  @HttpCode(200)
  @ApiOperation({ description: 'Login a user' })
  @ApiResponse({ description: 'Login a user' })
  @Throttle({default:{ttl:60000,limit:5}}) // 5 Requests in 1 minute
  public login(@Body() body: userLoginDto) {
    return this.authProvider.login(body);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ description: 'Get current user' })
  public getProfile(@CurrentUser() payload: JwtPayloadType) {
    return this.usersService.getCurrentUser(payload.id)
  }
  // ~/api/users
  @Get('all')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ description: 'Get all user' })
  public getAllUser() {
    return this.usersService.getAllCurrentUser()
  }

  @Post('profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({type:ImageUploadDto,description:'image upload dto'})
  @ApiSecurity('bearer')
  @ApiOperation({ description: 'Upload a profile image' })
  @ApiResponse({ description: 'Upload a profile image' })
  @Throttle({default:{ttl:60000,limit:2}}) // 2 Requests in 1 minute
  public async uploudProfileImage(@UploadedFile()file:Express.Multer.File,@CurrentUser() payload:JwtPayloadType){
    if(!file) throw new BadRequestException('file is required')
    return this.usersService.setprofileImage(payload.id,file.filename)
  };

  @Get("profile-image/:id")
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiSecurity('bearer')
  @ApiOperation({ description: 'Get profile image' })
  @ApiResponse({ description: 'Get profile image' })
  public async getProfileImage(@CurrentUser() payload:JwtPayloadType) { 
    return  this.usersService.getProfileImage(payload.id);    
  } 
  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN,UserType.NORMAL_USER)
  @UseGuards(AuthRoleGuard)
  @ApiOperation({ description: 'Delete a user' })
  @ApiResponse({ description: 'Delete a user' })
  public deleteUser(@CurrentUser() payload:JwtPayloadType) {
    return this.usersService.removeProfileIamge(payload.id);
  }
  //~users/verify/:userid/verificationToken`

  @Get("verify/:id/:verificationToken")
  @ApiOperation({ description: 'Verify a user' })
  @ApiResponse({ description: 'Verify a user' })
  public verify(@Param('id',ParseIntPipe)id:number,@Param('verificationToken')verifyToken:string) {
    return this.authProvider.verifyEmail(id,verifyToken);
  }

  @Post('forget-password')
  @ApiOperation({ description: 'Send a reset password link' })
  @ApiResponse({ description: 'Send a reset password link' })
  @Throttle({default:{ttl:60000,limit:3}}) // 3 Requests in 1 minute
  public forgotPassword(@Body() body:forgetPasswordDto){
    return this.authProvider.sendResetPasswordLink(body.email);
  }

 @Get("reset-password/:token")
 @ApiOperation({ description: 'Get a reset password link' })
  public getResetPassword(@Param('token')token:string)
   {
    return this.authProvider.validateResetToken(token);
  }

  @Post('reset-password')
  @ApiOperation({ description: 'Reset a password' })
  @ApiResponse({ description: 'Reset a password' })
  @Throttle({default:{ttl:60000,limit:3}}) // 3 Requests in 1 minute
  public resetPassword(@Body() body:resetPasswordDto){
    return this.authProvider.resetPassword(body.token,body.newPassword);
  }

  

  
}
