import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from '../../../src/application/services/sale.service';
import { ISaleRepository, SALE_REPOSITORY } from '../../../src/core/repositories/sale.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../src/core/repositories/user.repository';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../../src/core/repositories/product.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../src/core/enums/user-role.enum';
import { ProductEntity } from '../../../src/core/entities/product.entity';
import { UserEntity } from '../../../src/core/entities/user.entity';
import { SaleEntity } from '../../../src/core/entities/sale.entity';
import { CreateSaleDto } from 'src/application/dtos/sale/create-sale.dto';

describe('SaleService', () => {
  let service: SaleService;
  let saleRepository: jest.Mocked<ISaleRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockSaleRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPartner: jest.fn(),
    count: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };

  const mockProductRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: SALE_REPOSITORY,
          useValue: mockSaleRepository,
        },
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    saleRepository = module.get(SALE_REPOSITORY);
    userRepository = module.get(USER_REPOSITORY);
    productRepository = module.get(PRODUCT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createSaleDto: CreateSaleDto = {
      partnerId: 1,
      customerId: 2,
      productId: 3,
      value: 200
    };

    const mockProduct = new ProductEntity(3, 'Product', 100, true, new Date());
    const mockCustomer = new UserEntity(2, 'Customer', 'customer@test.com', UserRole.CUSTOMER, new Date());
    const mockPartner = new UserEntity(1, 'Partner', 'partner@test.com', UserRole.PARTNER, new Date());
    const mockSale = new SaleEntity(1, 200, 3, 2, 1, new Date());

    it('should create a sale successfully', async () => {
      productRepository.findById.mockResolvedValue(mockProduct);
      userRepository.findById.mockResolvedValueOnce(mockCustomer);
      userRepository.findById.mockResolvedValueOnce(mockPartner);
      saleRepository.create.mockResolvedValue(mockSale);

      const result = await service.create(createSaleDto);

      expect(result).toEqual(mockSale);
      expect(productRepository.findById).toHaveBeenCalledWith(createSaleDto.productId);
      expect(userRepository.findById).toHaveBeenCalledWith(createSaleDto.customerId);
      expect(userRepository.findById).toHaveBeenCalledWith(createSaleDto.partnerId);
      expect(saleRepository.create).toHaveBeenCalledWith(createSaleDto);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(service.create(createSaleDto)).rejects.toThrow(NotFoundException);
      expect(productRepository.findById).toHaveBeenCalledWith(createSaleDto.productId);
    });

    it('should throw BadRequestException when product has no stock', async () => {
      const outOfStockProduct = new ProductEntity(3, 'Product', 100, false, new Date());
      productRepository.findById.mockResolvedValue(outOfStockProduct);

      await expect(service.create(createSaleDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      productRepository.findById.mockResolvedValue(mockProduct);
      userRepository.findById.mockResolvedValueOnce(null);

      await expect(service.create(createSaleDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user is not a customer', async () => {
      const notCustomer = new UserEntity(2, 'Admin', 'admin@test.com', UserRole.ADMIN, new Date());
      productRepository.findById.mockResolvedValue(mockProduct);
      userRepository.findById.mockResolvedValueOnce(notCustomer);

      await expect(service.create(createSaleDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when partner does not exist', async () => {
      productRepository.findById.mockResolvedValue(mockProduct);
      userRepository.findById.mockResolvedValueOnce(mockCustomer);
      userRepository.findById.mockResolvedValueOnce(null);

      await expect(service.create(createSaleDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user is not a partner', async () => {
      const notPartner = new UserEntity(1, 'Customer', 'customer2@test.com', UserRole.CUSTOMER, new Date());
      productRepository.findById.mockResolvedValue(mockProduct);
      userRepository.findById.mockResolvedValueOnce(mockCustomer);
      userRepository.findById.mockResolvedValueOnce(notPartner);

      await expect(service.create(createSaleDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated sales', async () => {
      const mockSales = [
        new SaleEntity(1, 100, 3, 2, 1, new Date()),
        new SaleEntity(2, 200, 3, 2, 1, new Date()),
      ];

      saleRepository.findAll.mockResolvedValue(mockSales);
      saleRepository.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockSales);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return a sale when found', async () => {
      const mockSale = new SaleEntity(1, 100, 3, 2, 1, new Date());
      saleRepository.findById.mockResolvedValue(mockSale);

      const result = await service.findById(1);

      expect(result).toEqual(mockSale);
      expect(saleRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when sale does not exist', async () => {
      saleRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });
});
