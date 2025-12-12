import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './entities/products.entity';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { title } from 'process';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository:Repository<Product>;
  let REPOSITORY_TOKEN = getRepositoryToken(Product);

  const createProduct = {
    title:"Test Product",
    description:"This is a test product",
    price:100

  }
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide:UsersService,
          useValue:{
            getCurrentUser:jest.fn((userId:number)=> Promise.resolve({id:userId,name:"Test User"}))
          },
        },
        {
          provide:REPOSITORY_TOKEN,
          useValue:{
            create:jest.fn().mockImplementation((dto:CreateProductDto)=> dto),
            save:jest.fn().mockImplementation((product:CreateProductDto)=> Promise.resolve({...product, id:1})),
          }
        }

      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('productsRepository should be defined', () => {
    expect(productsRepository).toBeDefined();
  });

  describe("createProduct",()=>{ 
    it("should create a new product",async()=>{ 
    await service.createNew(createProduct,1);
    expect(productsRepository.create).toHaveBeenCalled();
    expect(productsRepository.create).toHaveBeenCalledTimes(1);
    });
    
    it("should save the new product",async()=>{
      await service.createNew(createProduct,1);
      expect(productsRepository.save).toHaveBeenCalled();
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
    } 
    );


  })
});
