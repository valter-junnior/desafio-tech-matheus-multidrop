crie um todo.md e uma documentacao.md que crie um mini backend inspirado em um sistema de parceiros/vendas (estilo marketplace / afiliados).

o projeto ficara no /backend onde devera ser iniciado o projeto ainda pelo npm e fazendo a instalacao de tudo que é necessario e configar se for melhor em vez de fazer criar um setup.md

O sistema deve permitir:
Cadastro de usuários
Cadastro de produtos
Registro de vendas
Cálculo simples de comissão
Endpoint de relatório

Stack obrigatória
Node.js
NestJS
TypeScript
Postgres
Prisma
Docker


funcionalidades obrigatórias
1 Usuários

Criar uma entidade User com:
    id
    name
    email
    role (ADMIN, PARTNER, CUSTOMER)
    createdAt

Endpoints:
    POST /users
    GET /users

Validações mínimas:
    Email único
    Campos obrigatórios

2 Produtos
Entidade Product:
    id
    name
    price
    active
Endpoints:
    POST /products
    GET /products

3 Vendas
Entidade Sale:
    id
    productId
    customerId
    partnerId (quem indicou)
    value
    createdAt
Regras:
    O partnerId deve ser um usuário com role PARTNER
    O customerId deve ser um usuário com role CUSTOMER
Endpoints:
    POST /sales
    GET /sales
5 Comissão
Regra simples:
    O parceiro recebe 10% do valor da venda
Criar endpoint:
    GET /partners/:id/commissions
    Retorno:
    {
    "partnerId": 1,
    "totalSales": 10,
    "totalCommission": 250.00
    }

5 Relatório
Endpoint:
    GET /reports/sales
Filtros via query params:
    startDate
    endDate
    partnerId

🔐 Requisitos não funcionais
arquitetura limp e ddd
DTOs + validação (class-validator)
Separação clara:
controller
service
repository
Código legível
Nada de lógica no controller
Tratamento básico de erros

README explicando:
como rodar
decisões técnicas

Adicionais:
Autenticação simples JWT fake
Migrations
Seed de dados
Docker / docker-compose
Teste unitário de 1 service
Paginação em listas
