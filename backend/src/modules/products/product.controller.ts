import { Controller, Get, Post, Body, Query, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    data: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.productService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productService.findById(id);
  }
}
