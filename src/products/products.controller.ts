import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete,ParseIntPipe,forwardRef } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from "./products.service";
type productType = { id: number, title: string, price: number }

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productService: ProductService) { }
   
  //POST: ~/api/proucts
  @Post()
  public createNewProduct(@Body() body: CreateProductDto) {
    return this.productService.createNew(body);
  };
  //GET: ~/api/proucts
  @Get()
  public getAllProducts() {
   return this.productService.getAll();
  }
  //GET: ~/api/proucts/:id
  @Get(':id')
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOne(id);
  };
  //PUT: ~/api/proucts/:id
  @Put(':id')
  public UpdateOneProducts(@Param('id') id: number, @Body() body: UpdateProductDto) {
   return this.productService.UpdateOne(id,body);
  };
  //DELET: ~/api/proucts/:id
  @Delete(':id')
  public DeleteOneProducts(@Param('id') id: number) {
    return this.productService.DeleteOne(id);
  };

}
