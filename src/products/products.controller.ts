import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, ParseIntPipe, forwardRef, UseGuards, Query } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from "./products.service";
import { AuthRoleGuard } from "../users/guards/auth-role.guard";
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../users/entities/user.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtPayloadType } from '../utils/type';
import { ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  //POST: ~/api/proucts
  @Post()
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  @ApiOperation({description: 'Create a new product' })
  @ApiResponse({description: 'Create a new product' })
  public createNewProduct(@Body() body: CreateProductDto, @CurrentUser() payload: JwtPayloadType) {
    return this.productService.createNew(body, payload.id);
  };
  //GET: ~/api/proucts
  @Get()
  @ApiOperation({description: 'Get List of all products' })
  @ApiQuery({ name: 'title', type: 'string',required: false })
  @ApiQuery({ name: 'maxPrice', type: 'string',required: false })
  @ApiQuery({ name: 'minPrice', type: 'string',required: false })
  public getAllProducts(
    @Query('title') title?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string
  ) {
    return this.productService.getAll(title, maxPrice, minPrice);
  }
  @Get('/admin')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  @ApiOperation({description: 'Get List of all products' })
  public getAllProductsAdmin(
    @Query('title') title?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string
  ) {
    return this.productService.getAllforAdmin(true, title, maxPrice, minPrice);
  }
  //GET: ~/api/proucts/:id 
  @Get(':id')
  @ApiOperation({description: 'Get a single products' })
  @ApiResponse({description: 'Get a single products' })
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOne(id);
  };
  //PUT: ~/api/proucts/:id (admin only)
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  @ApiOperation({description: 'update a products' })
  @Put(':id')
  public UpdateOneProducts(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productService.UpdateOne(id, body);
  };
  //DELET: ~/api/proucts/:id (admin only)
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  @ApiOperation({description: 'Delete a products' })
  @Delete(':id')
  public DeleteOneProducts(@Param('id') id: number) {
    return this.productService.DeleteOne(id);
  };
}
