import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../../../src/application/services/report.service';
import { IReportRepository, REPORT_REPOSITORY } from '../../../src/core/repositories/report.repository';
import { SaleEntity } from 'src/core/entities/sale.entity';
import { UserRole } from 'src/core/enums/user-role.enum';
import { ProductEntity } from 'src/core/entities/product.entity';
import { UserEntity } from 'src/core/entities/user.entity';

describe('ReportService', () => {
  let service: ReportService;
  let reportRepository: jest.Mocked<IReportRepository>;

  const mockReportRepository = {
    getSalesReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: REPORT_REPOSITORY,
          useValue: mockReportRepository,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    reportRepository = module.get(REPORT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSalesReport', () => {
      const product1 = new ProductEntity(1, 'Product 1', 100, true, new Date());
      const product2 = new ProductEntity(2, 'Product 2', 200, true, new Date());

      const customer = new UserEntity(2, 'Customer 1', 'customer1@test.com', UserRole.CUSTOMER, new Date());
      const partner = new UserEntity(3, 'Partner 1', 'partner1@test.com', UserRole.PARTNER, new Date());

      const mockSales: SaleEntity[] = [
        new SaleEntity(
          1, 100, product1.id, customer.id, partner.id,
          new Date(),
          product1,
          customer,
          partner,
        ),
        new SaleEntity(
          2, 200, product2.id, customer.id, partner.id,
          new Date(),
          product2,
          customer,
          partner,
        ),
      ];

    it('should return sales report with all data', async () => {
      reportRepository.getSalesReport.mockResolvedValue({
        sales: mockSales,
        totalSales: 2,
        totalValue: 300,
      });

      const query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        partnerId: 3,
      };

      const result = await service.getSalesReport(query);

      expect(result.totalSales).toBe(2);
      expect(result.totalValue).toBe(300);
      expect(result.sales).toHaveLength(2);
      expect(result.sales[0].product.name).toBe('Product 1');
      expect(reportRepository.getSalesReport).toHaveBeenCalledWith({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        partnerId: 3,
      });
    });

    it('should return sales report without filters', async () => {
      reportRepository.getSalesReport.mockResolvedValue({
        sales: [],
        totalSales: 0,
        totalValue: 0,
      });

      const result = await service.getSalesReport({});

      expect(result.totalSales).toBe(0);
      expect(result.totalValue).toBe(0);
      expect(reportRepository.getSalesReport).toHaveBeenCalledWith({});
    });

    it('should handle partial filters', async () => {
      reportRepository.getSalesReport.mockResolvedValue({
        sales: [],
        totalSales: 0,
        totalValue: 0,
      });

      const query = { startDate: '2024-01-01' };
      await service.getSalesReport(query);

      expect(reportRepository.getSalesReport).toHaveBeenCalledWith({
        startDate: new Date('2024-01-01'),
      });
    });

    it('should handle sales with missing relations', async () => {
      reportRepository.getSalesReport.mockResolvedValue({
        sales: mockSales.slice(0, 1),
        totalSales: 1,
        totalValue: 100,
      });

      const result = await service.getSalesReport({});

      expect(result.sales[0].product.id).toBe(0);
      expect(result.sales[0].product.name).toBe('');
      expect(result.sales[0].customer.id).toBe(0);
      expect(result.sales[0].partner.id).toBe(0);
    });
  });
});
