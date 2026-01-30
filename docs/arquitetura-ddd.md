# Arquitetura DDD Implementada

## 📐 Estrutura do Projeto

O projeto foi refatorado para seguir os princípios de **Domain-Driven Design (DDD)** e **Clean Code**, criando uma separação clara entre camadas e responsabilidades.

### 🏗️ Camadas Implementadas

```
backend/src/modules/
├── users/
│   ├── entities/
│   │   └── user.entity.ts         # Domain Entity com lógica de negócio
│   ├── mappers/
│   │   └── user.mapper.ts         # Mapeamento entre Prisma e Domain
│   ├── dto/
│   │   ├── create-user.dto.ts     # DTO de entrada
│   │   └── user-response.dto.ts   # DTO de saída
│   ├── user.repository.ts         # Acesso a dados (Infraestrutura)
│   ├── user.service.ts            # Regras de aplicação
│   ├── user.controller.ts         # Interface HTTP
│   └── user.module.ts
├── products/
│   ├── entities/
│   │   └── product.entity.ts
│   ├── mappers/
│   │   └── product.mapper.ts
│   ├── dto/
│   ├── product.repository.ts
│   ├── product.service.ts
│   └── ...
└── sales/
    ├── entities/
    │   └── sale.entity.ts
    ├── mappers/
    │   └── sale.mapper.ts
    ├── dto/
    ├── sale.repository.ts
    ├── sale.service.ts
    └── ...
```

## 📦 Camadas DDD

### 1. **Domain Layer (Entities)**

As entities contêm a lógica de domínio e regras de negócio. São independentes de frameworks e infraestrutura.

**Características:**
- Encapsulamento de dados (propriedades privadas)
- Validações de domínio
- Métodos de negócio
- Factory methods para criação
- Conversão para objetos simples

**Exemplo - UserEntity:**
```typescript
export class UserEntity {
  private _id: number;
  private _name: string;
  private _email: string;
  private _role: UserRole;
  
  // Métodos de domínio
  isPartner(): boolean
  isCustomer(): boolean
  canReceiveCommission(): boolean
  
  // Validações
  private validate(): void
}
```

### 2. **Mappers**

Responsáveis por converter entre modelos Prisma (infraestrutura) e Domain Entities.

**Padrão implementado:**
```typescript
export class UserMapper {
  static toDomain(prismaUser: User): UserEntity
  static toPrisma(entity: UserEntity): Omit<User, 'id' | 'createdAt'>
  static toDomainArray(prismaUsers: User[]): UserEntity[]
}
```

### 3. **Repository (Infraestrutura)**

Gerencia persistência de dados e converte entre camada de infraestrutura e domínio.

**Responsabilidades:**
- Operações CRUD no banco
- Usa mappers para conversão
- Retorna Domain Entities
- Isolamento do Prisma

**Exemplo:**
```typescript
async findById(id: number): Promise<UserEntity | null> {
  const user = await this.prisma.user.findUnique({ where: { id } });
  return user ? UserMapper.toDomain(user) : null;
}
```

### 4. **Services (Aplicação)**

Orquestra casos de uso e regras de aplicação usando as entities.

**Características:**
- Coordena múltiplos repositories
- Usa métodos de domínio das entities
- Aplica regras de negócio da aplicação
- Retorna DTOs

**Exemplo:**
```typescript
async create(createSaleDto: CreateSaleDto) {
  const product = await this.productRepository.findById(...);
  
  // Usa métodos de domínio da entity
  if (!product.isAvailableForSale()) {
    throw new BadRequestException('Produto não disponível');
  }
  
  const customer = await this.userRepository.findById(...);
  if (!customer.isCustomer()) {
    throw new BadRequestException('Deve ser um cliente');
  }
  // ...
}
```

### 5. **DTOs**

Data Transfer Objects para entrada e saída da API.

**Características:**
- Validação de entrada (class-validator)
- Documentação Swagger
- Aceita tanto objetos simples quanto Entities
- Conversão automática

```typescript
constructor(partial: Partial<UserResponseDto> | UserEntity) {
  if (partial instanceof UserEntity) {
    Object.assign(this, partial.toObject());
  } else {
    Object.assign(this, partial);
  }
}
```

## 🌱 Sistema de Seeders Modular

O sistema de seeds foi refatorado para ser modular e reutilizável.

### Estrutura de Seeders

```
backend/prisma/
├── seeders/
│   ├── user.seeder.ts        # Seed de usuários
│   ├── product.seeder.ts     # Seed de produtos
│   └── sale.seeder.ts        # Seed de vendas
├── seed.ts                    # Seed principal (completo)
├── seed-users.ts             # Seed apenas usuários
├── seed-products.ts          # Seed apenas produtos
└── seed-sales.ts             # Seed apenas vendas
```

### Comandos Disponíveis

```bash
# Seed completo (todos os dados)
npm run prisma:seed

# Seeds individuais
npm run prisma:seed:users
npm run prisma:seed:products
npm run prisma:seed:sales
```

### Exemplo de Seeder Modular

```typescript
// user.seeder.ts
export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...');
  
  const admin = await prisma.user.create({ ... });
  const partners = [...];
  const customers = [...];
  
  console.log('✅ Users seeded successfully');
  
  return { admin, partners, customers };
}
```

## 🎯 Benefícios da Arquitetura DDD

### 1. **Separação de Responsabilidades**
- Domain: regras de negócio puras
- Application: casos de uso
- Infrastructure: persistência e frameworks

### 2. **Testabilidade**
- Entities podem ser testadas isoladamente
- Mocks mais fáceis com interfaces claras
- Testes de domínio sem banco de dados

### 3. **Manutenibilidade**
- Mudanças no Prisma não afetam o domínio
- Lógica de negócio centralizada nas entities
- Código mais legível e organizado

### 4. **Escalabilidade**
- Fácil adicionar novos módulos
- Reutilização de entities e mappers
- Seeders modulares permitem dados específicos

### 5. **Independência de Framework**
- Domain layer não depende do NestJS ou Prisma
- Pode trocar ORM sem afetar regras de negócio
- Lógica de domínio portável

## 📚 Boas Práticas Implementadas

### Clean Code

✅ **Nomes Significativos**: Classes, métodos e variáveis com nomes claros
✅ **Single Responsibility**: Cada classe tem uma única responsabilidade
✅ **DRY (Don't Repeat Yourself)**: Mappers e seeders reutilizáveis
✅ **Encapsulamento**: Propriedades privadas nas entities
✅ **Métodos Pequenos**: Funções focadas e coesas

### DDD

✅ **Entities**: Objetos com identidade e lógica de domínio
✅ **Value Objects**: Objetos imutáveis (DTOs)
✅ **Repositories**: Abstração de persistência
✅ **Services**: Orquestração de casos de uso
✅ **Mappers**: Conversão entre camadas

### Arquitetura Limpa

✅ **Camadas Bem Definidas**: Domain, Application, Infrastructure
✅ **Dependências Direcionadas**: Infrastructure depende de Domain
✅ **Inversão de Dependência**: Uso de abstrações (repositories)
✅ **Testabilidade**: Componentes desacoplados

## 🔄 Fluxo de Dados

```
┌─────────────┐
│  Controller │  ← HTTP Request
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Service   │  ← Application Logic
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Repository  │  ← Data Access
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Mapper    │  ← Conversion
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Entity    │  ← Domain Logic
└─────────────┘
```

## 🚀 Próximos Passos

Para evoluir ainda mais a arquitetura, considere:

1. **Use Cases**: Criar classes específicas para cada caso de uso
2. **Domain Events**: Implementar eventos de domínio
3. **Aggregates**: Agrupar entities relacionadas
4. **Specifications**: Padrão para queries complexas
5. **CQRS**: Separar leitura e escrita se necessário

## 📖 Referências

- [Domain-Driven Design by Eric Evans](https://domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
