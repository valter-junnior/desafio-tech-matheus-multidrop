# Sistema de Marketplace/Afiliados - Backend

API REST desenvolvida com NestJS para gerenciamento de marketplace com programa de afiliados.

## 🚀 Stack

- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Docker & Docker Compose

## ⚡ Início Rápido

```bash
docker compose up -d --build
```

**URLs:**
- 🌐 API: http://localhost:3000
- 📚 Swagger: http://localhost:3000/api/docs

## 📚 Endpoints Principais

- `POST /users` - Criar usuário
- `POST /products` - Criar produto
- `POST /sales` - Registrar venda
- `GET /partners/:id/commissions` - Comissões do parceiro
- `GET /reports/sales` - Relatório de vendas