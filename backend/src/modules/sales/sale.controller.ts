import { Controller, Get, Post, Body, Query, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto, SaleDetailResponseDto } from './dto/sale-response.dto';

@ApiTags('sales')
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nova venda' })
  @ApiResponse({ status: 201, description: 'Venda registrada com sucesso', type: SaleResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto, cliente ou parceiro não encontrado' })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createSaleDto: CreateSaleDto,
  ): Promise<SaleResponseDto> {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as vendas' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de vendas retornada com sucesso' })
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
  @ApiOperation({ summary: 'Buscar venda por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da venda' })
  @ApiResponse({ status: 200, description: 'Venda encontrada', type: SaleDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SaleDetailResponseDto> {
    return this.saleService.findById(id);
  }
}
