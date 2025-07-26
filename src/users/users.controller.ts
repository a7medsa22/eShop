import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './user.service';
@Controller('api/users')
export class UsersController {
  constructor(private usersService:UsersService){}
  @Post()
  createUser() {
    return this.usersService.create();
  }

  //Get ~/api/users
  @Get()
  getUser() {
    return this.usersService.getAll();
  };
  
}
