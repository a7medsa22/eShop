import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Product>;
  let REPOSITORY_TOKEN = getRepositoryToken(Product);

  
  const createProductDto = {
    title: 'Sample Product',
    description: 'This is a sample product description.',
    price: 99.99,
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
            provide:UsersService,
            useValue:{
                getCurrentUser:jest.fn((userId:number)=>Promise.resolve({id:userId})),
                
            }
        },
        {
            provide: REPOSITORY_TOKEN,
            useValue: {
                create:jest.fn()((dto:CreateProductDto)=>dto),
                save:jest.fn()((dto:CreateProductDto)=>Promise.resolve({...dto, id:1})),
            },
            
        }
    ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
    
    });
    it('should product be defined', () => {
        expect(productsService).toBeDefined();
    });

     it('should productsRepository be defined', () => {
        expect(productsRepository).toBeDefined();
    });

});
