import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../src/application/services/product.service';
import { IProductRepository, PRODUCT_REPOSITORY } from '../src/core/repositories/product.repository';
import { NotFoundException } from '@nestjs/common';
import { ProductEntity } from '../src/core/entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockProductRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(PRODUCT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const mockProduct = new ProductEntity(
        1,
        createProductDto.name,
        createProductDto.price,
        true,
        new Date(),
      );

      productRepository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        new ProductEntity(1, 'Product 1', 100, true, new Date()),
        new ProductEntity(2, 'Product 2', 200, true, new Date()),
      ];

      productRepository.findAll.mockResolvedValue(mockProducts);
      productRepository.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(productRepository.findAll).toHaveBeenCalledWith(0, 10);
    });

    it('should calculate correct pagination for multiple pages', async () => {
      productRepository.findAll.mockResolvedValue([]);
      productRepository.count.mockResolvedValue(25);

      const result = await service.findAll(2, 10);

      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(2);
      expect(productRepository.findAll).toHaveBeenCalledWith(10, 10);
    });
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      const mockProduct = new ProductEntity(
        1,
        'Product 1',
        100,
        true,
        new Date(),
      );

      productRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findById(1);

      expect(result).toEqual(mockProduct);
      expect(productRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(productRepository.findById).toHaveBeenCalledWith(999);
    });
  });
});
