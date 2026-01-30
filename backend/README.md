# Sistema de Marketplace/Afiliados - Backend

API REST desenvolvida com NestJS para gerenciamento de um sistema de marketplace com programa de afiliados, incluindo cadastro de usuários, produtos, vendas e cálculo de comissões.

## 🚀 Tecnologias

- **NestJS** 11.x - Framework Node.js
- **TypeScript** 5.x
- **Prisma ORM** 7.x - Gerenciamento de banco de dados
- **PostgreSQL** 15 - Banco de dados relacional
- **Swagger** - Documentação automática da API
- **Docker & Docker Compose** - Containerização
- **Class Validator** - Validação de dados
- **ESLint & Prettier** - Qualidade de código

## 📋 Pré-requisitos

- Node.js >= 24.0.0
- npm >= 10.0.0
- Docker & Docker Compose (para rodar via container)

## 🛠️ Instalação

### Com Docker (Recomendado) 🐳

**Iniciar todo o ambiente (um único comando):**
```bash
docker compose up -d --build
```

Isso irá:
- ✅ Iniciar PostgreSQL
- ✅ Gerar Prisma Client
- ✅ Executar migrations do banco
- ✅ Popular banco com dados de exemplo (seed)
- ✅ Iniciar API em modo watch (hot reload)

**URLs disponíveis:**
- 🌐 API: http://localhost:3000
- 📚 Swagger: http://localhost:3000/api/docs
- 🗄️ PostgreSQL: localhost:5432

**Comandos úteis:**
```bash
# Ver logs da aplicação
docker compose logs -f app

# Ver status dos containers
docker compose ps

# Parar tudo
docker compose down

# Parar e limpar banco de dados
docker compose down -v

# Reconstruir
docker compose up -d --build
```

### Sem Docker

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Edite o .env com suas configurações do PostgreSQL

# Aplicar migrations
npm run prisma:migrate

# Rodar seed
npm run prisma:seed

# Iniciar aplicação
npm run start:dev
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://marketplace:marketplace123@localhost:5432/marketplace?schema=public"
```

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run start:dev      # Inicia em modo watch
npm run start:debug    # Inicia em modo debug
```

### Build & Produção
```bash
npm run build         # Compila o projeto
npm run start:prod    # Roda versão compilada
```

### Banco de Dados (Prisma)
```bash
npm run prisma:generate        # Gera Prisma Client
npm run prisma:migrate         # Cria e aplica migrations
npm run prisma:migrate:deploy  # Aplica migrations (produção)
npm run prisma:seed            # Popula banco com dados iniciais
npm run prisma:studio          # Interface visual do banco
```

### Testes
```bash
npm run test          # Roda testes unitários
npm run test:watch    # Testes em modo watch
npm run test:cov      # Testes com cobertura
npm run test:e2e      # Testes end-to-end
```

### Qualidade de Código
```bash
npm run lint          # Executa ESLint
npm run format        # Formata código com Prettier
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse:

- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000

### Endpoints Principais

#### Usuários
- `POST /users` - Criar usuário (ADMIN, PARTNER, CUSTOMER)
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário por ID

#### Produtos
- `POST /products` - Criar produto
- `GET /products` - Listar produtos
- `GET /products/:id` - Buscar produto por ID

#### Vendas
- `POST /sales` - Registrar venda
- `GET /sales` - Listar vendas
- `GET /sales/:id` - Buscar venda por ID

#### Parceiros
- `GET /partners/:partnerId/commissions` - Calcular comissões do parceiro

#### Relatórios
- `GET /reports/sales` - Relatório de vendas por período

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas inspirada em Clean Architecture e DDD:

```
src/
├── application/          # Casos de uso e DTOs
│   ├── dtos/            # Data Transfer Objects
│   └── services/        # Serviços de aplicação
├── core/                # Núcleo do domínio
│   ├── entities/        # Entidades de domínio
│   ├── enums/           # Enumerações
│   └── repositories/    # Interfaces de repositórios
├── infrastructure/      # Implementações técnicas
│   ├── database/        # Prisma e banco de dados
│   │   └── prisma/      # Schema, migrations, seeders
│   │       └── repositories/  # Implementações dos repositórios
│   └── http/            # Camada HTTP
│       ├── controllers/ # Controladores REST
│       ├── presenters/  # Transformação de dados para API
│       └── requests/    # Validação de entrada
└── main.ts             # Bootstrap da aplicação
```

### Camadas

- **Application**: Lógica de negócio e orquestração
- **Core**: Entidades e contratos do domínio (independente de frameworks)
- **Infrastructure**: Implementações técnicas (Prisma, HTTP, etc)

## 🗄️ Modelo de Dados

### User
```typescript
- id: Int (PK)
- name: String
- email: String (unique)
- role: UserRole (ADMIN | PARTNER | CUSTOMER)
- createdAt: DateTime
```

### Product
```typescript
- id: Int (PK)
- name: String
- price: Float
- active: Boolean
- createdAt: DateTime
```

### Sale
```typescript
- id: Int (PK)
- value: Float
- createdAt: DateTime
- productId: Int (FK)
- customerId: Int (FK)
- partnerId: Int (FK)
```

## 💡 Regras de Negócio

### Cálculo de Comissões
- Parceiros recebem **10%** de comissão sobre suas vendas
- A comissão é calculada sobre o valor total da venda
- Apenas usuários com role `PARTNER` podem receber comissões

### Validações
- Email deve ser único no sistema
- Produtos inativos não podem ser utilizados em vendas
- Vendas devem ter: produto, cliente e parceiro válidos
- Valores monetários devem ser positivos

## 🐳 Docker

### Serviços

- **postgres**: PostgreSQL 15 (porta 5432)
- **app**: NestJS application (porta 3000)

### Comandos Úteis

```bash
# Ver logs
docker compose logs -f app

# Reiniciar serviço
docker compose restart app

# Parar containers
docker compose down

# Parar e remover volumes
docker compose down -v
```

## 🧪 Testes

O projeto inclui configuração para:

- **Testes Unitários**: Jest
- **Testes E2E**: Supertest
- **Cobertura de Código**: Jest Coverage

```bash
# Rodar todos os testes
npm test

# Com cobertura
npm run test:cov
```

## 📝 Desenvolvimento

### Criar Nova Migration

```bash
# Modificar schema.prisma
# Depois executar:
npm run prisma:migrate
```

### Adicionar Novo Endpoint

1. Criar DTO em `application/dtos/`
2. Criar/atualizar serviço em `application/services/`
3. Criar request validator em `infrastructure/http/requests/`
4. Criar presenter em `infrastructure/http/presenters/`
5. Criar/atualizar controller em `infrastructure/http/controllers/`

## 🔒 Segurança

- Validação de entrada com class-validator
- Sanitização de dados
- CORS habilitado
- Prepared statements (Prisma)
