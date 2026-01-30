import { Test, TestingModule } from '@nestjs/testing';
import { PartnerService } from '../src/application/services/partner.service';
import { IUserRepository, USER_REPOSITORY } from '../src/core/repositories/user.repository';
import { ISaleRepository, SALE_REPOSITORY } from '../src/core/repositories/sale.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole } from '../src/core/enums/user-role.enum';
import { UserEntity } from '../src/core/entities/user.entity';
import { SaleEntity } from '../src/core/entities/sale.entity';

describe('PartnerService', () => {
  let service: PartnerService;
  let userRepository: jest.Mocked<IUserRepository>;
  let saleRepository: jest.Mocked<ISaleRepository>;

  const mockUserRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };

  const mockSaleRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPartner: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: SALE_REPOSITORY,
          useValue: mockSaleRepository,
        },
      ],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
    userRepository = module.get(USER_REPOSITORY);
    saleRepository = module.get(SALE_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommissions', () => {
    it('should calculate commissions for a partner successfully', async () => {
      const partnerId = 1;
      const mockPartner = new UserEntity(
        partnerId,
        'Partner',
        'partner@test.com',
        UserRole.PARTNER,
        new Date(),
        new Date(),
      );

      const mockSales = [
        new SaleEntity(1, 100, 1, 2, 1, new Date()),
        new SaleEntity(2, 50, 2, 2, 1, new Date()),
      ];

      userRepository.findById.mockResolvedValue(mockPartner);
      saleRepository.findByPartner.mockResolvedValue(mockSales);

      const result = await service.getCommissions(partnerId);

      expect(result).toEqual({
        partnerId,
        partnerName: 'Partner',
        totalSales: 2,
        totalValue: 150,
        commissionRate: 0.1,
        totalCommission: 15,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(partnerId);
      expect(saleRepository.findByPartner).toHaveBeenCalledWith(partnerId);
    });

    it('should throw NotFoundException when partner does not exist', async () => {
      const partnerId = 999;
      userRepository.findById.mockResolvedValue(null);

      await expect(service.getCommissions(partnerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(partnerId);
    });

    it('should throw BadRequestException when user is not a partner', async () => {
      const userId = 1;
      const mockUser = new UserEntity(
        userId,
        'Customer',
        'customer@test.com',
        UserRole.CUSTOMER,
        new Date(),
        new Date(),
      );

      userRepository.findById.mockResolvedValue(mockUser);

      await expect(service.getCommissions(userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return zero commission when partner has no sales', async () => {
      const partnerId = 1;
      const mockPartner = new UserEntity(
        partnerId,
        'Partner',
        'partner@test.com',
        UserRole.PARTNER,
        new Date(),
        new Date(),
      );

      userRepository.findById.mockResolvedValue(mockPartner);
      saleRepository.findByPartner.mockResolvedValue([]);

      const result = await service.getCommissions(partnerId);

      expect(result.totalSales).toBe(0);
      expect(result.totalValue).toBe(0);
      expect(result.totalCommission).toBe(0);
    });
  });
});
