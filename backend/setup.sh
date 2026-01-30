#!/bin/bash

echo "🚀 Setup do Sistema de Marketplace/Afiliados"
echo "=============================================="
echo ""

# Verificar versão do Node
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ ERRO: Node.js 20+ é necessário!"
    echo "Sua versão: $(node -v)"
    echo ""
    echo "Por favor, consulte NODE_VERSION.md para instruções de atualização."
    echo "Ou use Docker: docker-compose up -d"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo ""

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
echo "✅ Dependências instaladas"
echo ""

# Gerar Prisma Client
echo "⚙️  Gerando Prisma Client..."
npm run prisma:generate
echo "✅ Prisma Client gerado"
echo ""

# Verificar se o PostgreSQL está rodando
echo "🔍 Verificando conexão com PostgreSQL..."
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL está rodando"
    
    # Rodar migrations
    echo ""
    echo "📊 Rodando migrations..."
    npm run prisma:migrate
    echo "✅ Migrations aplicadas"
    
    # Rodar seed
    echo ""
    echo "🌱 Populando banco de dados..."
    npm run prisma:seed
    echo "✅ Banco populado com dados iniciais"
else
    echo "⚠️  PostgreSQL não está acessível em localhost:5432"
    echo "   Você pode:"
    echo "   1. Iniciar PostgreSQL localmente"
    echo "   2. Usar Docker: docker-compose up -d"
    echo ""
    echo "   Depois rode:"
    echo "   npm run prisma:migrate"
    echo "   npm run prisma:seed"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "Para iniciar a aplicação, rode:"
echo "  npm run start:dev"
echo ""
echo "A aplicação estará disponível em: http://localhost:3000"
