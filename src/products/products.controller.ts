import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, ParseIntPipe, forwardRef, UseGuards, Query } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from "./products.service";
import { AuthRoleGuard } from "../users/guards/auth-role.guard";
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/type';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  //POST: ~/api/proucts
  @Post()
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  public createNewProduct(@Body() body: CreateProductDto, @CurrentUser() payload: JwtPayloadType) {
    return this.productService.createNew(body, payload.id);
  };
  //GET: ~/api/proucts
  @Get()
  public getAllProducts(
    @Query('title') title?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string
  ) {
    return this.productService.getAll(false, title, maxPrice, minPrice);
  }
  @Get('/admin')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  public getAllProductsAdmin(
    @Query('title') title?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string
  ) {
    return this.productService.getAll(true, title, maxPrice, minPrice);
  }
  //GET: ~/api/proucts/:id 
  @Get(':id')
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOne(id);
  };
  //PUT: ~/api/proucts/:id (admin only)
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @Put(':id')
  public UpdateOneProducts(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productService.UpdateOne(id, body);
  };
  //DELET: ~/api/proucts/:id (admin only)
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @Delete(':id')
  public DeleteOneProducts(@Param('id') id: number) {
    return this.productService.DeleteOne(id);
  };

}
