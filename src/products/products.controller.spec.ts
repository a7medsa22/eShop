import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthRoleGuard } from 'src/users/guards/auth-role.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtPayloadType } from 'src/utils/type';
import { UserType } from 'src/users/entities/user.entity';
import type { Product } from './entities/products.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  // Mocked service type with only the methods we need
  type ProductsServiceMock = jest.Mocked<Pick<ProductsService, 'createNew' | 'getAll' | 'getOne' | 'UpdateOne' | 'DeleteOne'>>;
  let service: ProductsServiceMock;

  const currentUser: JwtPayloadType = {
    id: 1,
    userType: UserType.ADMIN,
  };

  const createProductDto: CreateProductDto = {
    title: 'Test Product',
    description: 'This is a test product',
    price: 100,
  };
  const updateProductDto: UpdateProductDto = {
    title: 'Test Update',
    description: 'This is a test product',
    price: 100,
  };

  // Sample product list for getAll tests
  let products: Product[];

  // Helper to create a mocked Product
  const mockProduct = (overrides: Partial<Product> = {}): Product => ({
    id: 1,
    title: 'Test Product',
    description: 'This is a test product',
    price: 100,
    createAt: new Date(),
    updateAt: new Date(),
    reviews: [],
    user: {} as any,
    ...overrides,
  });

  const mockProductsService: ProductsServiceMock = {
    createNew: jest.fn(),
    getAll: jest.fn(),
    getOne: jest.fn(),
    UpdateOne: jest.fn(),
    DeleteOne: jest.fn(),

  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Example products for getAll
    products = [
      { id: 1, title: 'Test Product 1', price: 50 } as unknown as Product,
      { id: 2, title: 'Test Product 2', price: 150 } as unknown as Product,
      { id: 3, title: 'Test Product 3', price: 300 } as unknown as Product,
      { id: 4, title: 'Another Product', price: 400 } as unknown as Product,
    ];

    // Mock getAll method (matching controller's param order)
    mockProductsService.getAll.mockImplementation(
      (title?: string, minPrice?: number, maxPrice?: number) => {
        if (title) return Promise.resolve(products.filter(p => p.title.includes(title)));
        if (minPrice !== undefined && maxPrice !== undefined)
          return Promise.resolve(products.filter(p => p.price >= minPrice && p.price <= maxPrice));
        return Promise.resolve(products);
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
      .overrideGuard(AuthRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get(ProductsService) as ProductsServiceMock;
  });

  // Sanity checks
  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Product', () => {
    it('should call createNew with correct params and return result', async () => {
      // Arrange
      const created = mockProduct();
      service.createNew.mockResolvedValue(created);
      // Act
      const result = await controller.createNewProduct(createProductDto, currentUser);

      // Assert
      expect(service.createNew).toHaveBeenCalledTimes(1);
      expect(service.createNew).toHaveBeenCalledWith(createProductDto, currentUser.id);
      expect(result).toMatchObject({ id: 1, ...createProductDto });
    });
  });

  describe('Get All Products', () => {
    it('should call getAll with correct params', async () => {
      await controller.getAllProducts();
      expect(service.getAll).toHaveBeenCalledWith(undefined, undefined, undefined);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return all products when no filters', async () => {
      const result = await controller.getAllProducts();
      expect(result).toEqual(products);
      expect(result).toHaveLength(4);
    });

    it('should filter products by title', async () => {
      const result = await controller.getAllProducts('Test');
      expect(result.every(p => p.title.includes('Test'))).toBe(true);
    });

    it('should filter products by minPrice and maxPrice', async () => {
      const result = await controller.getAllProducts(undefined, "200", "500");
      expect(result.every(p => p.price >= 200 && p.price <= 500)).toBe(true);
    });
  });

  describe('Get One Product', () => {
    it('should call getOne with correct params and return result', async () => {
      // Arrange
      const product = mockProduct();
      service.getOne.mockResolvedValue(product);
     // Act
      const result = await controller.getSingleProducts(1);
    // Assert
      expect(service.getOne).toHaveBeenCalledWith(1);
      expect(result).toMatchObject(product);
    });
    it('should throw error if product not found', async () => {
      service.getOne.mockRejectedValue(new NotFoundException('Product not found'));

      await expect(controller.getSingleProducts(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Update Product', () => {
    it('should call updateOne with correct params and return result', async () => {
      //Arrange
      const updated = mockProduct();
      service.UpdateOne.mockResolvedValue(updated);

      // ACT
      const result = await controller.UpdateOneProducts(1, updateProductDto);

      // Assert
      expect(service.UpdateOne).toHaveBeenCalledTimes(1);
      expect(service.UpdateOne).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toMatchObject(updated);
    });
    it('should throw error if product not found', async () => {

      service.UpdateOne.mockRejectedValue
        (new NotFoundException('Product not found')
        );

      await expect(controller.UpdateOneProducts(1, updateProductDto))
        .rejects
        .toThrow(NotFoundException);
    })
  });
  
  describe('Delete Product', () => {
    it('should call deleteOne with correct params and return result', async () => {
      //Arrange
      const deleted = { message: 'product deleted successfully with id: 1' };
      service.DeleteOne.mockResolvedValue(deleted);

      // ACT
      const result = await controller.DeleteOneProducts(1);

      // Assert
      expect(service.DeleteOne).toHaveBeenCalledTimes(1);
      expect(service.DeleteOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleted);
    });
    it('should throw error if product not found', async () => {

      service.DeleteOne.mockRejectedValue
        (new NotFoundException('Product not found')
        );

      await expect(controller.DeleteOneProducts(1))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
