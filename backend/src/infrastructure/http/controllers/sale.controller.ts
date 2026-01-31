import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SaleService } from '../../../application/services/sale.service';
import { CreateSaleRequest } from '../requests/sale/create-sale.request';
import {
  SalePresenter,
  SaleDetailPresenter,
} from '../presenters/sale.presenter';
import { CreateSaleDto } from '../../../application/dtos/sale/create-sale.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../../core/enums/user-role.enum';

@ApiTags('sales')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.PARTNER)
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nova venda' })
  @ApiResponse({
    status: 201,
    description: 'Venda registrada com sucesso',
    type: SalePresenter,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 404,
    description: 'Produto, cliente ou parceiro não encontrado',
  })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createSaleRequest: CreateSaleRequest,
  ): Promise<SalePresenter> {
    const createSaleDto: CreateSaleDto = {
      productId: createSaleRequest.productId,
      customerId: createSaleRequest.customerId,
      partnerId: createSaleRequest.partnerId,
      value: createSaleRequest.value,
    };
    const sale = await this.saleService.create(createSaleDto);
    return SalePresenter.fromEntity(sale);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as vendas' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendas retornada com sucesso',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    data: SaleDetailPresenter[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const result = await this.saleService.findAll(pageNumber, limitNumber);

    return {
      data: result.data.map((sale) => SaleDetailPresenter.fromEntity(sale)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar venda por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da venda' })
  @ApiResponse({
    status: 200,
    description: 'Venda encontrada',
    type: SaleDetailPresenter,
  })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SaleDetailPresenter> {
    const sale = await this.saleService.findById(id);
    return SaleDetailPresenter.fromEntity(sale);
  }
}
