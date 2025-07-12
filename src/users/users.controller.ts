import { Controller, Get, Post } from '@nestjs/common';
@Controller({})
export class UsersController {
  // @Post('api/products')
  //   public

  //Get ~/api/users
  @Get('api/users')
  getUser() {
    return [
      { id: 1, name: 'Ahmed' },
      { id: 2, name: 'mohamed' },
    ];
  }
  
}
