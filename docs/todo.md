# TODO - Sistema de Parceiros/Vendas

## 📋 Configuração Inicial
- [ ] Inicializar projeto NestJS
- [ ] Configurar TypeScript
- [ ] Instalar dependências (Prisma, class-validator, class-transformer)
- [ ] Configurar Docker e docker-compose com Postgres
- [ ] Configurar Prisma com schema inicial

## 🔨 Implementação

### 1. Módulo de Usuários
- [ ] Criar entidade User (id, name, email, role, createdAt)
- [ ] Criar DTOs (CreateUserDto, UserResponseDto)
- [ ] Implementar validações (email único, campos obrigatórios)
- [ ] Criar UserRepository
- [ ] Criar UserService
- [ ] Criar UserController (POST /users, GET /users)
- [ ] Adicionar tratamento de erros

### 2. Módulo de Produtos
- [ ] Criar entidade Product (id, name, price, active)
- [ ] Criar DTOs (CreateProductDto, UpdateProductDto, ProductResponseDto)
- [ ] Criar ProductRepository
- [ ] Criar ProductService
- [ ] Criar ProductController (POST /products, GET /products)
- [ ] Adicionar validações

### 3. Módulo de Vendas
- [ ] Criar entidade Sale (id, productId, customerId, partnerId, value, createdAt)
- [ ] Criar DTOs (CreateSaleDto, SaleResponseDto)
- [ ] Implementar validações de role (PARTNER, CUSTOMER)
- [ ] Criar SaleRepository
- [ ] Criar SaleService
- [ ] Criar SaleController (POST /sales, GET /sales)

### 4. Módulo de Comissões
- [ ] Criar endpoint GET /partners/:id/commissions
- [ ] Implementar cálculo de 10% sobre vendas
- [ ] Criar DTO de resposta (totalSales, totalCommission)
- [ ] Adicionar ao PartnerController/Service

### 5. Módulo de Relatórios
- [ ] Criar endpoint GET /reports/sales
- [ ] Implementar filtros (startDate, endDate, partnerId)
- [ ] Criar ReportService
- [ ] Criar ReportController
- [ ] Adicionar paginação

## 🎯 Requisitos Não Funcionais
- [ ] Aplicar arquitetura limpa e DDD
- [ ] Separação: Controller → Service → Repository
- [ ] DTOs com class-validator em todas as entradas
- [ ] Tratamento global de exceções
- [ ] Nenhuma lógica de negócio nos controllers

## 🚀 Adicionais
- [ ] Implementar autenticação JWT básica
- [ ] Criar migrations do Prisma
- [ ] Criar seed de dados (usuários, produtos)
- [ ] Configurar docker-compose completo
- [ ] Criar teste unitário de pelo menos 1 service
- [ ] Adicionar paginação em listas (GET /users, /products, /sales)
- [ ] Criar .env.example

## 📝 Documentação
- [ ] Criar README.md completo
- [ ] Documentar como rodar o projeto
- [ ] Explicar decisões técnicas
- [ ] Documentar estrutura de pastas
- [ ] Adicionar exemplos de requisições

## ✅ Finalização
- [ ] Testar todos os endpoints
- [ ] Validar regras de negócio
- [ ] Revisar código
- [ ] Garantir que Docker funciona
- [ ] Verificar se seed funciona corretamente
