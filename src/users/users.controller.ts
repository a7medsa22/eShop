import { Body, Controller, Get, HttpCode, Post, UseGuards,UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserRegisterDto } from './dtos/user.register';
import { userLoginDto } from './dtos/user.login';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/type';
import { AuthGuard } from './guards/auth.guard';
import { UserType } from 'src/utils/user.entity';
import { Roles } from './decorators/user-role.decorator';
import { AuthRoleGuard } from './guards/auth-role.guard';
import { ClassSerializerInterceptor } from '@nestjs/common';
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
}
