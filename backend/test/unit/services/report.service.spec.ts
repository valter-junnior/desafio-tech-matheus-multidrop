import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../../../src/application/services/report.service';
import { IReportRepository, REPORT_REPOSITORY } from '../../../src/core/repositories/report.repository';

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
    it('should return sales report with all data', async () => {
      const mockSales = [
        {
          id: 1,
          value: 100,
          createdAt: new Date(),
          product: { id: 1, name: 'Product 1' },
          customer: { id: 2, name: 'Customer 1' },
          partner: { id: 3, name: 'Partner 1' },
        },
        {
          id: 2,
          value: 200,
          createdAt: new Date(),
          product: { id: 2, name: 'Product 2' },
          customer: { id: 2, name: 'Customer 1' },
          partner: { id: 3, name: 'Partner 1' },
        },
      ];

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
      const mockSales = [
        {
          id: 1,
          value: 100,
          createdAt: new Date(),
          product: null,
          customer: null,
          partner: null,
        },
      ];

      reportRepository.getSalesReport.mockResolvedValue({
        sales: mockSales,
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
