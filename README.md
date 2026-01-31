# Sistema de Marketplace/Afiliados

Sistema de marketplace com programa de afiliados usando NestJS e React.

## Stack

**Backend:**
- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Docker & Docker Compose
- JWT Authentication
- Winston Logger
- Jest

**Frontend:**
- React 19 + TypeScript + Vite
- TailwindCSS + shadcn/ui
- React Router Dom
- TanStack Query
- Zustand
- Axios + Zod

## Decisões Técnicas

### Backend

**Arquitetura:** Clean Architecture com Repository, Service, DTO e Controllers.

**Prisma:** Configurado em `infrastructure/database` para isolar dependências técnicas da lógica de negócio.

**Camadas auxiliares:**
- **Presenters**: Transformam entidades em respostas HTTP
- **Requests**: Validam entrada com class-validator
- **Mappers**: Convertem entre Prisma e entidades de domínio

### Frontend

**Arquitetura por features:** Cada domínio (`auth`, `user`, `product`, `sale`, `report`) tem seus próprios componentes, hooks e páginas. Componentes compartilhados ficam em `shared/`.

**Estado:**
- **TanStack Query**: Cache e sincronização com API
- **Zustand**: Estado global simples (auth, UI)
- **React Hook Form + Zod**: Validação de formulários

**Vite:** Build tool rápido com HMR instantâneo.

### Melhorias Futuras

Para produção, seria interessante adicionar:

**Arquitetura:**
- DDD completo para bounded contexts
- Event Sourcing para auditoria
- CQRS para otimizar leitura/escrita

**Observabilidade:**
- Notificações de erros (Discord/Slack)
- APM (Datadog, New Relic)

**Performance:**
- Redis para cache
- Rate limiting

**Database:**
- UUID v7 em vez de IDs sequenciais
- Soft delete para auditoria

**Frontend:**
- Componente `DataTable` genérico para reutilização (evita duplicação de código nas listagens)
- Layout responsivo para mobile
- Testes E2E com Playwright
- Skeleton loading states
- Tratamento de erros mais robusto com boundary components

## Como Usar

### Backend

```bash
docker compose up -d --build
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173

## Autenticação

JWT com roles: `ADMIN`, `PARTNER`, `CUSTOMER`

**Variável:**
```env
JWT_SECRET=fake-jwt-secret-key
```

**Endpoints públicos:**
- `GET /` - Health check

**Endpoints protegidos:**
- Usuários, Produtos, Vendas - Qualquer autenticado
- `GET /partners/:id/commissions` - PARTNER, ADMIN
- `GET /reports/sales` - ADMIN apenas

## Testes

```bash
npm test
```

Cobertos: Partner, Product, Sale, User e Report Services.

## Endpoints

obs: Algumas rotas do frontend não funcinam como edita e excluir já que não foram implementadas no backend.

Toda rotas são protegida menos autenticação:

**Auth:**
- `POST /auth/generate-token`

**Usuários:**
- `POST /users`, `GET /users`, `GET /users/:id`

**Produtos:**
- `POST /products`, `GET /products`, `GET /products/:id`

**Vendas:**
- `POST /sales`, `GET /sales`, `GET /sales/:id`

**Parceiros:**
- `GET /partners/:id/commissions`

**Relatórios:**
- `GET /reports/sales`

## Arquitetura

### Backend

```
src/
├── application/        # Casos de uso e DTOs
│   ├── dtos/          # Data Transfer Objects
│   └── services/      # Services + testes unitários
├── core/              # Domínio (Entities, Enums)
│   ├── entities/      # Entidades de domínio
│   ├── enums/         # Enumerações
│   └── repositories/  # Interfaces dos repositórios
├── infrastructure/    # Implementações técnicas
│   ├── auth/          # JWT Strategy, Guards, Decorators
│   ├── database/      # Prisma, Migrations, Seeders
│   ├── logger/        # Winston Logger (rotação diária)
│   └── http/          # Controllers, Presenters, Requests, Filters
└── main.ts            # Entry point
```

### Frontend

```
src/
├── app/
│   ├── config/         # Configurações (constants, query-client)
│   ├── routes/         # Configuração de rotas (ProtectedRoute)
│   └── services/       # Services da API (auth, user, product, sale, report)
├── features/           # Funcionalidades por domínio
│   ├── auth/           # Autenticação (hooks, pages)
│   ├── user/           # Usuários (components, hooks, pages)
│   ├── product/        # Produtos (components, hooks, pages)
│   ├── sale/           # Vendas (components, hooks, pages)
│   └── report/         # Relatórios (components, hooks, pages)
├── layout/             # Layouts principais (MainLayout)
├── shared/             # Recursos compartilhados
│   ├── components/     # Componentes reutilizáveis
│   ├── hooks/          # Hooks customizados
│   └── libs/           # Bibliotecas utilitárias
├── types/              # Tipagens TypeScript (dto, entities)
└── main.tsx            # Entry point
```

## Banco de Dados

### Migrations
```bash
npm run prisma:migrate
```

### Seed (popular banco)
```bash
# Migrations
npm run prisma:migrate

# Seed (popular dados)
npm run prisma:seed
```

## Variáveis de Ambiente

**Backend:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="fake-jwt-secret-key"
PORT=3000
LOG_LEVEL=info
```

**Frontend:**
```env
VITE_API_URL="http://localhost:3000"
```