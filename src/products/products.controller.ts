import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete,ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
type productType = { id: number, title: string, price: number }

@Controller('api/products')
export class ProductsController {
  private products: productType[] = [
    { id: 1, title: 'phone', price: 500 },
    { id: 2, title: 'book', price: 20 },
  ];

  //POST: ~/api/proucts
  @Post()
  public createNewProduct(@Body() body: CreateProductDto) {
    const newProduct: productType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price
    };
    this.products.push(newProduct)
    return newProduct;
  };
  //GET: ~/api/proucts
  @Get()
  public getAllProducts() {
    return this.products;
  }
  //GET: ~/api/proucts/:id
  @Get(':id')
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    const product = this.products.find(p => p.id === id)
    if (!product) {
      throw new NotFoundException("product Not found");
    }
    return product;
  };
  //PUT: ~/api/proucts/:id
  @Put(':id')
  public UpdateOneProducts(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const product = this.products.find(p => p.id === parseInt(id))
    if (!product) {
      throw new NotFoundException("product Not found");
    }
    return { message: `product update success with id: ${id}` };
  };
  //DELET: ~/api/proucts/:id
  @Delete(':id')
  public getOneProducts(@Param('id') id: string) {
    const product = this.products.find(p => p.id === parseInt(id))
    if (!product) {
      throw new NotFoundException("product Not found");
    }
    return { message: `product Delete success with id: ${id}` };
  };

}
