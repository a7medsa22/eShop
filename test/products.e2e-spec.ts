import { AppModule } from "../src/app.module";
import { CreateProductDto } from "../src/products/dtos/create-product.dto";
import { Product } from "../src/products/entities/products.entity";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import request from 'supertest'
import { TestAppModule } from "./test-app.module";
describe('ProductsController', () => {
    let dataSource: DataSource;
    let app: INestApplication;
    let productsToSave: CreateProductDto[];

    beforeAll(async () => {
        productsToSave = [
            { title: 'laptop', description: 'this is laptop test', price: 100 },
            { title: 'phone', description: 'this is phone test', price: 200 },
            { title: 'book', description: 'this is book test', price: 500 },
            { title: 'keyboard', description: 'this is keyboard test', price: 600 },
        ]
        const module: TestingModule = await Test.createTestingModule({
            imports: [TestAppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        dataSource = app.get(DataSource);

    }, 20000);

    afterAll(async () => {
        if (app) {
            await app.close();
        }
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }, 20000);

    describe('GET', () => {
        it('should return all Products from database', async () => {
            await dataSource.createQueryBuilder()
            .insert()
            .into(Product)
            .values(productsToSave).
            execute();

            const response = await request(app.getHttpServer()).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(4); 
        });
    });

})
