# 📚 Documentação - Sistema de Parceiros/Vendas

## 🎯 Visão Geral

Sistema backend de marketplace/afiliados desenvolvido com NestJS, permitindo gerenciamento de usuários, produtos, vendas e cálculo de comissões para parceiros.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Runtime**: Node.js
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Containerização**: Docker & Docker Compose
- **Validação**: class-validator & class-transformer

### Padrões Arquiteturais

#### Clean Architecture + DDD
O projeto segue os princípios de Clean Architecture e Domain-Driven Design:

```
src/
├── domain/           # Entidades de domínio (regras de negócio)
│   ├── entities/     # Modelos de domínio
│   └── repositories/ # Interfaces de repositórios
├── application/      # Casos de uso e lógica de aplicação
│   ├── dtos/         # Data Transfer Objects
│   └── services/     # Serviços de aplicação
├── infrastructure/   # Implementações concretas
│   ├── database/     # Prisma e repositórios
│   └── config/       # Configurações
└── presentation/     # Camada de apresentação
    └── controllers/  # Controllers HTTP
```

#### Separação de Responsabilidades
- **Controllers**: Apenas recebem requisições e delegam para services
- **Services**: Contêm a lógica de negócio e orquestração
- **Repositories**: Abstração de acesso aos dados
- **DTOs**: Validação e transformação de dados de entrada/saída

## 📊 Modelo de Dados

### User (Usuário)
```typescript
{
  id: number
  name: string
  email: string (único)
  role: ADMIN | PARTNER | CUSTOMER
  createdAt: Date
}
```

**Roles**:
- `ADMIN`: Administrador do sistema
- `PARTNER`: Parceiro/afiliado que pode receber comissões
- `CUSTOMER`: Cliente que realiza compras

### Product (Produto)
```typescript
{
  id: number
  name: string
  price: number
  active: boolean
  createdAt: Date
}
```

### Sale (Venda)
```typescript
{
  id: number
  productId: number      // FK para Product
  customerId: number     // FK para User (CUSTOMER)
  partnerId: number      // FK para User (PARTNER)
  value: number
  createdAt: Date
}
```

## 🔌 API Endpoints

### Usuários

#### POST /users
Cria um novo usuário.

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CUSTOMER"
}
```

**Response**: 201 Created
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CUSTOMER",
  "createdAt": "2026-01-30T10:00:00.000Z"
}
```

#### GET /users
Lista todos os usuários (com paginação).

**Query Params**:
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10)

**Response**: 200 OK

---

### Produtos

#### POST /products
Cria um novo produto.

**Request Body**:
```json
{
  "name": "Curso de TypeScript",
  "price": 299.90,
  "active": true
}
```

#### GET /products
Lista todos os produtos (com paginação).

---

### Vendas

#### POST /sales
Registra uma nova venda.

**Request Body**:
```json
{
  "productId": 1,
  "customerId": 2,
  "partnerId": 3,
  "value": 299.90
}
```

**Validações**:
- `partnerId` deve ser um usuário com role `PARTNER`
- `customerId` deve ser um usuário com role `CUSTOMER`
- Produto deve existir e estar ativo

#### GET /sales
Lista todas as vendas.

---

### Comissões

#### GET /partners/:id/commissions
Calcula as comissões de um parceiro.

**Response**: 200 OK
```json
{
  "partnerId": 3,
  "totalSales": 10,
  "totalCommission": 250.00
}
```

**Regra**: Parceiro recebe 10% do valor de cada venda.

---

### Relatórios

#### GET /reports/sales
Gera relatório de vendas com filtros.

**Query Params**:
- `startDate`: data inicial (ISO 8601)
- `endDate`: data final (ISO 8601)
- `partnerId`: filtrar por parceiro específico

**Response**: 200 OK
```json
{
  "totalSales": 50,
  "totalValue": 12500.00,
  "sales": [...]
}
```

## 🔐 Segurança

### Autenticação JWT (Opcional)
Sistema implementa autenticação básica com JWT para proteger endpoints sensíveis.

**Login**: POST /auth/login
```json
{
  "email": "admin@example.com",
  "password": "senha123"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {...}
}
```

## ✅ Validações

Todas as entradas são validadas usando `class-validator`:

- **Email**: formato válido e único no sistema
- **Campos obrigatórios**: name, email, role
- **Enums**: role deve ser ADMIN, PARTNER ou CUSTOMER
- **Números**: price e value devem ser positivos
- **Referências**: IDs devem existir no banco

## 🐳 Docker

### Serviços
- **postgres**: Banco de dados PostgreSQL 15
- **app**: Aplicação NestJS

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://user:password@postgres:5432/marketplace
JWT_SECRET=your-secret-key
PORT=3000
```

## 🧪 Testes

### Testes Unitários
Exemplo de teste de service:

```typescript
describe('UserService', () => {
  it('should create a user', async () => {
    const dto = { name: 'Test', email: 'test@example.com', role: 'CUSTOMER' };
    const user = await userService.create(dto);
    expect(user.email).toBe(dto.email);
  });
});
```

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   ├── migrations/       # Migrations
│   └── seed.ts          # Seed de dados
├── src/
│   ├── modules/         # Módulos da aplicação
│   │   ├── users/
│   │   ├── products/
│   │   ├── sales/
│   │   ├── partners/
│   │   └── reports/
│   ├── common/          # Código compartilhado
│   │   ├── filters/     # Exception filters
│   │   └── pipes/       # Validation pipes
│   ├── config/          # Configurações
│   └── main.ts          # Entry point
├── test/                # Testes
├── .env                 # Variáveis de ambiente
├── .env.example         # Exemplo de .env
├── docker-compose.yml   # Orquestração Docker
├── Dockerfile           # Build da aplicação
├── package.json
└── tsconfig.json
```

## 🚀 Decisões Técnicas

### 1. NestJS
Escolhido por:
- Arquitetura modular e escalável
- Suporte nativo a TypeScript
- Dependency Injection
- Ecossistema maduro

### 2. Prisma
Escolhido por:
- Type-safety completo
- Migrations automáticas
- Queries otimizadas
- Excelente DX

### 3. Clean Architecture + DDD
- Facilita testes
- Baixo acoplamento
- Alta coesão
- Manutenibilidade

### 4. DTOs com Validação
- Segurança na entrada de dados
- Documentação implícita
- Mensagens de erro claras

### 5. Repository Pattern
- Abstração do banco de dados
- Facilita testes (mocks)
- Permite trocar ORM se necessário

## 🔄 Fluxo de Uma Requisição

```
HTTP Request
    ↓
Controller (validação básica)
    ↓
Service (lógica de negócio)
    ↓
Repository (acesso ao banco)
    ↓
Prisma (query SQL)
    ↓
PostgreSQL
```

## 📈 Melhorias Futuras

- [ ] Autenticação completa com refresh tokens
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Monitoring e observability
- [ ] Cache com Redis
- [ ] Documentação Swagger
- [ ] CI/CD pipeline
- [ ] Testes E2E
- [ ] Webhook para notificações de vendas
- [ ] Dashboard de analytics
