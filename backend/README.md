# 🛍️ Sistema de Marketplace / Afiliados

Sistema backend desenvolvido com NestJS para gerenciamento de parceiros, vendas e comissões, inspirado em um marketplace com sistema de afiliados.

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Decisões Técnicas](#-decisões-técnicas)
- [Testes](#-testes)

## 🚀 Stack Tecnológica

- **Node.js** 20+
- **NestJS** 11 - Framework backend
- **TypeScript** - Linguagem principal
- **PostgreSQL** 15 - Banco de dados
- **Prisma** - ORM
- **Docker & Docker Compose** - Containerização
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de dados

## ✨ Funcionalidades

### 1. Gerenciamento de Usuários
- Cadastro de usuários com 3 roles: ADMIN, PARTNER, CUSTOMER
- Listagem com paginação
- Validação de email único

### 2. Gerenciamento de Produtos
- Cadastro de produtos
- Controle de status ativo/inativo
- Listagem com paginação

### 3. Registro de Vendas
- Criação de vendas vinculando produto, cliente e parceiro
- Validação de roles (customer deve ser CUSTOMER, partner deve ser PARTNER)
- Validação de produto ativo
- Listagem com paginação e detalhes completos

### 4. Cálculo de Comissões
- Endpoint para consultar comissões de um parceiro
- Cálculo automático de 10% sobre vendas
- Retorna total de vendas, valor total e comissão

### 5. Relatórios
- Relatório de vendas com filtros:
  - Por período (startDate, endDate)
  - Por parceiro (partnerId)
- Totalizadores de vendas e valores

## 📦 Pré-requisitos

### Opção 1: Com Docker (Recomendado)
- Docker
- Docker Compose

### Opção 2: Local
- Node.js 20+ (obrigatório para Prisma)
- PostgreSQL 15+
- npm ou yarn

## 🏃 Como Rodar o Projeto

### Com Docker (Recomendado)

```bash
# 1. Clone o repositório
cd backend

# 2. Copie o arquivo .env.example
cp .env.example .env

# 3. Suba os containers
docker-compose up -d

# 4. Acesse o container da aplicação
docker-compose exec app sh

# 5. Rode as migrations
npm run prisma:migrate

# 6. Rode o seed (dados iniciais)
npm run prisma:seed

# 7. Acesse a aplicação
# http://localhost:3000
```

### Localmente (Node 20+)

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env
cp .env.example .env
# Edite o .env com suas configurações do PostgreSQL

# 3. Rode as migrations
npm run prisma:migrate

# 4. Gere o Prisma Client
npm run prisma:generate

# 5. Rode o seed
npm run prisma:seed

# 6. Inicie a aplicação
npm run start:dev

# Aplicação rodando em http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── database/                  # Módulo do Prisma
│   ├── prisma.service.ts
│   └── database.module.ts
├── modules/
│   ├── users/                 # Módulo de usuários
│   │   ├── dto/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   └── user.module.ts
│   ├── products/              # Módulo de produtos
│   │   ├── dto/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.repository.ts
│   │   └── product.module.ts
│   ├── sales/                 # Módulo de vendas
│   │   ├── dto/
│   │   ├── sale.controller.ts
│   │   ├── sale.service.ts
│   │   ├── sale.repository.ts
│   │   └── sale.module.ts
│   ├── partners/              # Módulo de comissões
│   │   ├── dto/
│   │   ├── partner.controller.ts
│   │   ├── partner.service.ts
│   │   └── partner.module.ts
│   └── reports/               # Módulo de relatórios
│       ├── dto/
│       ├── report.controller.ts
│       ├── report.service.ts
│       ├── report.repository.ts
│       └── report.module.ts
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma              # Schema do banco
├── migrations/                # Migrations
└── seed.ts                    # Seed de dados
```

## 🔌 API Endpoints

### Usuários

#### POST /users
Cria um novo usuário.

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CUSTOMER"
}
```

#### GET /users
Lista todos os usuários.

Query params: `page` (default: 1), `limit` (default: 10)

#### GET /users/:id
Busca usuário por ID.

---

### Produtos

#### POST /products
Cria um novo produto.

```json
{
  "name": "Curso de TypeScript",
  "price": 299.90,
  "active": true
}
```

#### GET /products
Lista todos os produtos.

Query params: `page`, `limit`

#### GET /products/:id
Busca produto por ID.

---

### Vendas

#### POST /sales
Registra uma nova venda.

```json
{
  "productId": 1,
  "customerId": 2,
  "partnerId": 3,
  "value": 299.90
}
```

**Validações:**
- `productId`: deve existir e estar ativo
- `customerId`: deve ser um usuário com role CUSTOMER
- `partnerId`: deve ser um usuário com role PARTNER

#### GET /sales
Lista todas as vendas.

Query params: `page`, `limit`

#### GET /sales/:id
Busca venda por ID.

---

### Comissões

#### GET /partners/:id/commissions
Calcula comissões de um parceiro.

**Response:**
```json
{
  "partnerId": 1,
  "partnerName": "João Silva",
  "totalSales": 10,
  "totalValue": 2999.00,
  "totalCommission": 299.90,
  "commissionRate": 0.1
}
```

---

### Relatórios

#### GET /reports/sales
Gera relatório de vendas.

Query params:
- `startDate`: Data inicial (ISO 8601: 2026-01-01)
- `endDate`: Data final
- `partnerId`: Filtrar por parceiro

**Response:**
```json
{
  "totalSales": 50,
  "totalValue": 12500.00,
  "filters": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "partnerId": 1
  },
  "sales": [...]
}
```

## 🎯 Decisões Técnicas

### 1. Arquitetura Clean Architecture + DDD

Optei por separar as responsabilidades em camadas:
- **Controllers**: Apenas recebem requisições HTTP e retornam respostas
- **Services**: Contêm toda a lógica de negócio
- **Repositories**: Abstraem o acesso ao banco de dados

**Benefícios:**
- Código mais testável
- Fácil manutenção
- Baixo acoplamento
- Fácil substituição de dependências

### 2. Repository Pattern

Criei uma camada de repository entre o service e o Prisma.

**Por quê:**
- Facilita testes unitários (podemos mockar facilmente)
- Permite trocar o ORM no futuro sem afetar os services
- Centraliza queries do banco

### 3. DTOs com Validação

Usei `class-validator` para validar todas as entradas.

**Benefícios:**
- Segurança: dados validados antes de processar
- Documentação implícita: DTOs mostram o formato esperado
- Mensagens de erro claras e consistentes

### 4. Separação de Concerns - Módulos

Cada domínio tem seu próprio módulo (users, products, sales, etc).

**Vantagens:**
- Código organizado e escalável
- Módulos independentes e reutilizáveis
- Facilita trabalho em equipe

### 5. Paginação

Implementei paginação em todas as listagens.

**Motivos:**
- Performance: não carrega todos os dados de uma vez
- UX: melhor experiência para o usuário
- Escalabilidade: suporta grandes volumes de dados

### 6. Global Exception Filter (implícito do NestJS)

O NestJS já trata exceções automaticamente, mas podemos customizar.

**Vantagens:**
- Respostas de erro consistentes
- Evita vazamento de informações sensíveis
- Facilita debugging

### 7. Prisma como ORM

Escolhi Prisma pelos seguintes motivos:
- **Type-safety completo**: erros em tempo de compilação
- **Migrations automáticas**: versionamento do banco
- **Performance**: queries otimizadas
- **DX (Developer Experience)**: autocompleção excelente

### 8. Docker Compose

Facilita o setup local e garante consistência entre ambientes.

**Inclui:**
- PostgreSQL 15
- Aplicação NestJS
- Volumes para persistência
- Network isolada

## 🧪 Testes

### Rodar testes unitários

```bash
npm test
```

### Rodar testes com coverage

```bash
npm run test:cov
```

### Exemplo de teste implementado

Foi criado um teste unitário para o `UserService` em:
`src/modules/users/user.service.spec.ts`

**Testa:**
- Criação de usuário com sucesso
- Validação de email duplicado
- Busca de usuário por ID
- Busca de usuário não encontrado
- Listagem paginada

## 📊 Seed de Dados

O projeto inclui dados iniciais para facilitar testes:

**Usuários:**
- 1 Admin
- 2 Partners
- 3 Customers

**Produtos:**
- 5 produtos variados

**Vendas:**
- 6 vendas de exemplo

Para popular o banco:
```bash
npm run prisma:seed
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo watch
npm run start:debug        # Inicia em modo debug

# Build
npm run build              # Build de produção
npm run start:prod         # Roda build de produção

# Prisma
npm run prisma:generate    # Gera Prisma Client
npm run prisma:migrate     # Cria e aplica migrations
npm run prisma:seed        # Popula banco com dados
npm run prisma:studio      # Abre Prisma Studio (GUI)

# Testes
npm test                   # Roda testes unitários
npm run test:watch         # Roda testes em modo watch
npm run test:cov           # Roda testes com coverage
npm run test:e2e           # Roda testes e2e

# Lint
npm run lint               # Verifica e corrige código
npm run format             # Formata código com Prettier
```

## 🐳 Comandos Docker Úteis

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar serviços
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Acessar bash do container
docker-compose exec app sh

# Ver status dos containers
docker-compose ps
```

## 🔒 Variáveis de Ambiente

Arquivo `.env`:

```env
DATABASE_URL="postgresql://marketplace:marketplace123@localhost:5432/marketplace"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NODE_ENV="development"
PORT=3000
```

## 📝 Próximos Passos (Melhorias Futuras)

- [ ] Implementar autenticação JWT completa
- [ ] Adicionar testes E2E
- [ ] Implementar Swagger/OpenAPI
- [ ] Adicionar rate limiting
- [ ] Implementar cache com Redis
- [ ] Adicionar logging estruturado
- [ ] Implementar soft delete
- [ ] Adicionar webhooks para notificações
- [ ] Dashboard de analytics

## 👨‍💻 Autor

Desenvolvido como desafio técnico.

## 📄 Licença

UNLICENSED
