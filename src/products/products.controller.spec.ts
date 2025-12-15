import { AuthRoleGuard } from "src/users/guards/auth-role.guard";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UserType } from "src/users/entities/user.entity";
import { JwtPayloadType } from "src/utils/type";

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const currentUser: JwtPayloadType = {
    id: 1,
    userType: UserType.ADMIN,
  };

  const createProductDto: CreateProductDto = {
    title: 'Test Product',
    description: 'This is a test product',
    price: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            createNew: jest.fn().mockResolvedValue({
              id: 1,
              ...createProductDto,
            }),
          },
        },
      ],
    })
      .overrideGuard(AuthRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Product', () => {
    it('should call createProduct with correct params', async () => {
      await controller.createNewProduct(createProductDto, currentUser);

      expect(service.createNew).toHaveBeenCalled();
      expect(service.createNew).toHaveBeenCalledTimes(1);
      expect(service.createNew).toHaveBeenCalledWith(
        createProductDto,
        currentUser.id 
      );
    });
  });
});
