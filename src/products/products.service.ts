import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

type productType = { id: number, title: string, price: number }
@Injectable()
export class ProductService {
    private products: productType[] = [
        { id: 1, title: 'phone', price: 500 },
        { id: 2, title: 'book', price: 20 },
    ];
/**
 * create new product
 */
    
    public createNew(body: CreateProductDto) {
        const newProduct: productType = {
            id: this.products.length + 1,
            title: body.title,
            price: body.price
        };
        this.products.push(newProduct)
        return newProduct;
    };
    /**
     * get all product
     */
    public getAll() {
        return this.products;
    }
    /**
     * get single product
     */
    public getOne(id: number) {
        const product = this.products.find(p => p.id === id)
        if (!product) {
            throw new NotFoundException("product Not found");
        }
        return product;
    };
    /**
     * update product
     */
    public UpdateOne(id: string, body: UpdateProductDto) {
        const product = this.products.find(p => p.id === parseInt(id))
        if (!product) {
            throw new NotFoundException("product Not found");
        }
        return { message: `product update success with id: ${id}` };
    };
    /**
     * delete product
     */
    public DeleteOne(id: string) {
        const product = this.products.find(p => p.id === parseInt(id))
        if (!product) {
            throw new NotFoundException("product Not found");
        }
        return { message: `product Delete success with id: ${id}` };
    };
    
}