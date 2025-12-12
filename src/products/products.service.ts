

import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/products.entity";
import { Between, Like, Repository } from "typeorm";
import { UsersService } from "../users/users.service";

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
        private readonly userService: UsersService
    ) { }
    /**
     * create new product
     * @param dto CreateProductDto - Data transfer object for creating a product
     * @param userId number - ID of the user creating the product
     * @returns Promise<Product> - The created product
     */

    public async createNew(dto: CreateProductDto, userId: number) {
        const user = await this.userService.getCurrentUser(userId)
        if (!user) {
            throw new NotFoundException("user not found")
        }
        const newProduct = this.productsRepository.create({
            ...dto,
            user
        });
        return this.productsRepository.save(newProduct, {

        });
    };
    /**
     * get all product
     */
    /**
     * Get all products with optional user relations for admin
     * @param isAdmin boolean - Whether to include user relations
     * @returns Promise<Product[]>
     */
    public async getAllforAdmin(isAdmin: boolean = false, title?: string, maxPrice?: string, minPrice?: string): Promise<Product[]> {
        const filters = {
            ...(title ? { title: Like(`%${title}%`) } : {}),
            ...(maxPrice && minPrice ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) } : {})
        }
        return this.productsRepository.find({
            where: filters,
            relations: {
                reviews: true,
                ...(isAdmin && { user: true })
            }
        });
    }
    public async getAll(title?: string, maxPrice?: string, minPrice?: string): Promise<Product[]> {
        const filters = {
            ...(title ? { title: Like(`%${title}%`) } : {}),
            ...(maxPrice && minPrice ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) } : {})
        }
        return this.productsRepository.find({where: filters});
    }
    /**
     * get single product
     * @param id number - ID of the product to retrieve
     * @returns Promise<Product> - The retrieved product
     */
    public async getOne(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({ where: { id }})
        if (!product) {
            throw new NotFoundException("Product Not Found");
        }
        return product;
    };
    /**
     * update product
     * @param id number - ID of the product to update
     * @param dto UpdateProductDto - Data transfer object for updating a product
     * @returns Promise<Product> - The updated product  
     */
    public async UpdateOne(id: number, dto: UpdateProductDto): Promise<Product> {
              const product = await this.getOne(id)

        product.title = dto.title ?? product.title
        product.description = dto.description ?? product.description
        product.price = dto.price ?? product.price;

        return this.productsRepository.save(product);
    };
    /**
     * delete product
     * @param id number - ID of the product to delete
     * @returns Promise<{message:string}> - A message indicating the success of the deletion
     */
    public async DeleteOne(id: number): Promise<{ message: string }> {
        const product = await this.getOne(id)

        await this.productsRepository.remove(product);
        return { message: `product deleted successfully with id: ${id}` };
    };

}