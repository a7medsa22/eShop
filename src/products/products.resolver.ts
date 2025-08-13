import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import { ProductsModule } from "./products.module";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/users/decorators/user-role.decorator";

@Resolver()
export class ProductResolver{
    constructor(private readonly productsService: ProductsService) { }

    }
