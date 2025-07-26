import {  Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product)
    private readonly productsRepository: Repository<Product>
    ) { }
    /**
     * create new product
     */

    public createNew(dto: CreateProductDto) {
        const newProduct = this.productsRepository.create(dto);
        return this.productsRepository.save(newProduct);
    };
    /**
     * get all product
     */
    public getAll() {
        return this.productsRepository.find();
    }
    /**
     * get single product
     */
    public async getOne(id: number) {
        const product = await this.productsRepository.findOne({ where: { id } })
        if (!product) {
            throw new NotFoundException("product Not found");
        }
        return product;
    };
    /**
     * update product
     */
    public async UpdateOne(id: number, dto: UpdateProductDto) {
        const product = await this.getOne(id)
       
        product.title = dto.title ?? product.title
        product.description = dto.description ?? product.description
        product.price = dto.price ?? product.price;

        return this.productsRepository.save(product);
    };
    /**
     * delete product
     */
    public async DeleteOne(id: number) {
        const product = await this.getOne(id)
       
        await this.productsRepository.remove(product);
        return { message: `product Delete success with id: ${id}` };
    };

}