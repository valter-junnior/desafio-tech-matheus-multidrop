import { Controller, Get, Post, Body, Query, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateUserRequest } from '../requests/user/create-user.request';
import { UserPresenter } from '../presenters/user.presenter';
import { UserService } from 'src/application/services/user.service';
import { UserRole } from '../../../core/enums/user-role.enum';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserPresenter })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserRequest: CreateUserRequest,
  ): Promise<UserPresenter> {
    const user = await this.userService.create(createUserRequest);
    return new UserPresenter(user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'role', required: false, type: String, description: 'Filtrar por role (ADMIN, PARTNER, CUSTOMER)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
  ): Promise<{
    data: UserPresenter[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const result = await this.userService.findAll(pageNumber, limitNumber, role as UserRole);
    
    return {
      ...result,
      data: result.data.map((user) => new UserPresenter(user)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserPresenter })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserPresenter> {
    const user = await this.userService.findById(id);
    return new UserPresenter(user);
  }
}
