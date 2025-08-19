import { Args, Float, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import { ProductsModule } from "./products.module";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/users/decorators/user-role.decorator";
import { ProductType } from "./models/product.model";
import { title } from "process";

@Resolver(()=>ProductType)
export class ProductResolver{
    constructor(private readonly productsService: ProductsService) { }

   @Query(()=>[ProductType])
    async getAllProduct(
        @Args('title',{type:()=> String,nullable:true}) title?:string,
        @Args('minPrice',{type: ()=>Float , nullable:true}) minPrice?:number,
        @Args('maxPrice',{type: ()=>Float , nullable:true}) maxPrice?:number,
 ){
    return this.productsService.getAll(false,title,minPrice?.toString(),maxPrice?.toString())
   }
  // Query: Get single product
  @Query(() => ProductType, { nullable: true })
  async getProductById(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.getOne(id);
  }
 

    }
