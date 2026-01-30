# 🚀 Desafio Tech - Sistema de Marketplace/Afiliados

## ✅ Projeto Inicializado com Sucesso!

Este repositório contém o sistema backend completo para gerenciamento de parceiros, vendas e comissões.

## 📂 Estrutura do Projeto

```
desafio-tech-matheus-multidrop/
├── docs/
│   ├── init.md           # Especificação inicial
│   ├── todo.md           # Lista de tarefas
│   └── documentacao.md   # Documentação técnica completa
└── backend/              # Aplicação NestJS
    ├── src/              # Código-fonte
    ├── prisma/           # Schema e migrations
    ├── docker-compose.yml
    ├── Dockerfile
    ├── README.md         # Documentação principal
    ├── API_GUIDE.md      # Guia de uso da API
    ├── NODE_VERSION.md   # ⚠️ IMPORTANTE: Leia sobre Node 20+
    └── setup.sh          # Script de instalação
```

## ⚠️ IMPORTANTE: Versão do Node.js

**Seu sistema tem Node v16, mas o projeto requer Node 20+**

### Soluções:

**Opção 1: Docker (Recomendado) ✅**
```bash
cd backend
docker-compose up -d
```

**Opção 2: Atualizar Node localmente**
Consulte: `backend/NODE_VERSION.md`

## 🎯 O Que Foi Implementado

### ✅ Funcionalidades Obrigatórias

- [x] **Usuários**: Cadastro com roles (ADMIN, PARTNER, CUSTOMER)
- [x] **Produtos**: Cadastro e gerenciamento com status ativo/inativo
- [x] **Vendas**: Registro com validações de roles
- [x] **Comissões**: Cálculo automático de 10% para parceiros
- [x] **Relatórios**: Filtros por data e parceiro

### ✅ Requisitos Não Funcionais

- [x] **Arquitetura**: Clean Architecture + DDD
- [x] **Validação**: DTOs com class-validator
- [x] **Separação**: Controller → Service → Repository
- [x] **Tratamento de Erros**: Global exception handling
- [x] **Código Limpo**: Lógica fora dos controllers

### ✅ Adicionais Implementados

- [x] **Docker/Docker Compose**: Ambiente completo
- [x] **Migrations**: Prisma migrations
- [x] **Seed**: Dados iniciais
- [x] **Teste Unitário**: UserService com Jest
- [x] **Paginação**: Em todas as listagens
- [x] **README**: Documentação completa

## 🚀 Como Iniciar

### Com Docker (Recomendado)

```bash
cd backend

# Subir containers
docker-compose up -d

# Acessar container
docker-compose exec app sh

# Dentro do container:
npm run prisma:migrate
npm run prisma:seed

# Aplicação rodando em http://localhost:3000
```

### Localmente (Após Atualizar Node para 20+)

```bash
cd backend

# Rodar script de setup
./setup.sh

# OU manualmente:
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

## 📚 Documentação

- **README.md**: Documentação completa do projeto
- **API_GUIDE.md**: Exemplos de uso da API com cURL
- **NODE_VERSION.md**: Como atualizar o Node.js
- **docs/documentacao.md**: Arquitetura e decisões técnicas
- **docs/todo.md**: Checklist de implementação

## 🧪 Testar a API

### Após rodar o seed, teste:

```bash
# Listar usuários
curl http://localhost:3000/users

# Listar produtos
curl http://localhost:3000/products

# Ver comissões do parceiro 2
curl http://localhost:3000/partners/2/commissions

# Relatório de vendas
curl http://localhost:3000/reports/sales
```

## 🔍 Verificar se Está Funcionando

```bash
# Ver logs
docker-compose logs -f app

# Verificar containers
docker-compose ps

# Acessar Prisma Studio (GUI do banco)
docker-compose exec app npx prisma studio
# Acesse: http://localhost:5555
```

## 📊 Stack Tecnológica

- Node.js 20+
- NestJS 11
- TypeScript
- PostgreSQL 15
- Prisma 7
- Docker & Docker Compose
- Jest (testes)

## 🎓 Endpoints Implementados

### Usuários
- `POST /users` - Criar usuário
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário

### Produtos
- `POST /products` - Criar produto
- `GET /products` - Listar produtos
- `GET /products/:id` - Buscar produto

### Vendas
- `POST /sales` - Registrar venda
- `GET /sales` - Listar vendas
- `GET /sales/:id` - Buscar venda

### Comissões
- `GET /partners/:id/commissions` - Calcular comissões

### Relatórios
- `GET /reports/sales` - Relatório de vendas (com filtros)

## 🎉 Status do Projeto

✅ **COMPLETO E PRONTO PARA USO**

Todos os requisitos foram implementados seguindo as melhores práticas de:
- Clean Architecture
- DDD (Domain-Driven Design)
- SOLID
- Testes
- Documentação

## 📞 Suporte

Para dúvidas sobre:
- **Como rodar**: Consulte `backend/README.md`
- **Node.js**: Consulte `backend/NODE_VERSION.md`
- **API**: Consulte `backend/API_GUIDE.md`
- **Arquitetura**: Consulte `docs/documentacao.md`

---

Desenvolvido com 💙 usando NestJS
