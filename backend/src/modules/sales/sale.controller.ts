import { Controller, Get, Post, Body, Query, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto, SaleDetailResponseDto } from './dto/sale-response.dto';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createSaleDto: CreateSaleDto,
  ): Promise<SaleResponseDto> {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    data: SaleDetailResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.saleService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SaleDetailResponseDto> {
    return this.saleService.findById(id);
  }
}
