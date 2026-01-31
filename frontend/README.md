# Frontend - Multidrop

Frontend da aplicação Multidrop desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes de UI reutilizáveis
- **React Router Dom** - Roteamento
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Axios** - Cliente HTTP
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **Zustand** - Gerenciamento de estado global
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── config/         # Configurações (constants, query-client)
│   ├── data/           # Data layer
│   ├── routes/         # Configuração de rotas (ProtectedRoute)
│   └── services/       # Services da API (auth, user, product, sale, report)
├── features/
│   ├── auth/           # Feature de autenticação
│   ├── user/           # Feature de usuários
│   ├── product/        # Feature de produtos
│   ├── sale/           # Feature de vendas
│   └── report/         # Feature de relatórios
├── layout/             # Layouts principais (MainLayout)
├── shared/
│   ├── components/     # Componentes compartilhados
│   ├── hooks/          # Hooks compartilhados
│   └── libs/           # Bibliotecas utilitárias
├── components/ui/      # Componentes UI do shadcn
└── lib/                # Utilitários (cn, etc)
```

## ⚙️ Configuração

### Pré-requisitos

- Node.js 24.x
- npm ou yarn

### Instalação

1. Clone o repositório e navegue até a pasta do frontend:

```bash
cd frontend
```

2. Use a versão correta do Node:

```bash
nvm use 24
```

3. Instale as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🏃 Executando

### Modo de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

## 🔐 Autenticação

O sistema usa autenticação JWT. Na página de login, você pode:

1. Inserir um email qualquer
2. Selecionar um perfil (Admin, Parceiro ou Cliente)
3. Um token JWT será gerado automaticamente pelo backend

## 📋 Funcionalidades

### Dashboard
- Visão geral do sistema
- Links rápidos para funcionalidades

### Usuários
- Listar todos os usuários
- Criar novos usuários
- Editar usuários existentes
- Excluir usuários
- Filtrar por perfil (Admin, Parceiro, Cliente)

### Produtos
- Listar todos os produtos
- Criar novos produtos
- Editar produtos existentes
- Excluir produtos
- Definir preço e comissão

### Vendas
- Listar todas as vendas
- Criar novas vendas
- Associar produto, parceiro e cliente
- Definir quantidade

### Relatórios
- **Relatório de Vendas**: Visualizar todas as vendas com detalhes
- **Relatório de Comissões**: Ver comissões por parceiro