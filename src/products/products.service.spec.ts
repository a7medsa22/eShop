import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './entities/products.entity';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
type ProductType = {
  id: number;
  title: string;
  price: number;
};
type Options = {where:{title?:string, maxPrice?:string, minPrice?:string}};
type findOneType = {where:{id:number}}; 

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Product>;
  let REPOSITORY_TOKEN = getRepositoryToken(Product);

  const createProduct = {
    title: 'Test Product',
    description: 'This is a test product',
    price: 100,
  };

  let products:ProductType[];

  beforeEach(async () => {
    products = [
      { id: 1, title: 'Test Product 1', price: 50 },
      { id: 2, title: 'Test Product 2', price: 150 },
      { id: 3, title: 'Another Product', price: 200 },
    ];
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: UsersService,
          useValue: {
            getCurrentUser: jest.fn((userId: number) =>
              Promise.resolve({ id: userId, name: 'Test User' }),
            ),
          },
        },
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateProductDto) => dto),
            save: jest.fn().mockImplementation((product: CreateProductDto) =>
                Promise.resolve({ ...product, id: 1 }),
              ),
            find: jest.fn().mockImplementation((options?:Options) =>{
              if(options?.where.title) return Promise.resolve([products[0], products[1]]);
              return Promise.resolve(products);
            }),
            findOne: jest.fn().mockImplementation((param: findOneType) =>{
              return Promise.resolve(products.find(p => p.id === param.where.id))
            })
          },
        },
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

  describe('createProduct', () => {
    it('should create a new product', async () => {
      await service.createNew(createProduct, 1);
      expect(productsRepository.create).toHaveBeenCalled();
      expect(productsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should save the new product', async () => {
      await service.createNew(createProduct, 1);
      expect(productsRepository.save).toHaveBeenCalled();
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll Products', () => {
    it('should call find method', async () => {
      await service.getAll();
      expect(productsRepository.find).toHaveBeenCalled();
      expect(productsRepository.find).toHaveBeenCalledTimes(1);
    });
    
    it('should return two Product', async () => {
    const result = await service.getAll("book");
      expect(result).toHaveLength(2)
    });


    it('should return all products', async () => {
      const result = await service.getAll();
      expect(result).toEqual(products);
      
    });
  });

  describe('getOne Product', () => {
    it('should call "findOne" method', async () => {
      await service.getOne(1);
      expect(productsRepository.findOne).toHaveBeenCalled();
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a single product', async () => {
      const result = await service.getOne(1);
      expect(result).toMatchObject(products[0]);
    });
    it('should return NotFoundException if product not found', async () => {
    try {
       await service.getOne(999);
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Product Not Found');
    }
    });
  });
});
