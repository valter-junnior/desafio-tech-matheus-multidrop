# Arquitetura Limpa - Documentação

## 📐 Visão Geral

O projeto agora segue os princípios da **Clean Architecture (Arquitetura Limpa)** de Robert C. Martin, garantindo:

- ✅ Separação clara de responsabilidades
- ✅ Inversão de Dependência (DIP)
- ✅ Independência de frameworks
- ✅ Testabilidade
- ✅ Manutenibilidade

## 🏗️ Estrutura por Camadas

### 1. Camada de Domínio (Domain Layer)

**Localização:** `src/modules/{module}/domain/`

**Responsabilidades:**
- Entidades de negócio com regras de domínio
- Interfaces de repositório (contratos)
- Enums e tipos de domínio
- Lógica de negócio pura

**Arquivos:**
```
domain/
├── enums/
│   └── user-role.enum.ts          # Enums do domínio (sem dependência do Prisma)
└── interfaces/
    └── {entity}-repository.interface.ts  # Contratos dos repositórios
```

**Exemplo:**
```typescript
// domain/interfaces/user-repository.interface.ts
export interface IUserRepository {
  create(data: CreateUserDto): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity | null>;
  // ... outros métodos
}

export const USER_REPOSITORY = Symbol('IUserRepository');
```

### 2. Camada de Entidades (Entities)

**Localização:** `src/modules/{module}/entities/`

**Responsabilidades:**
- Encapsular regras de negócio
- Validação de dados
- Métodos de domínio
- Não depender de frameworks ou infraestrutura

**Características:**
- ✅ Propriedades privadas com getters
- ✅ Métodos de validação internos
- ✅ Métodos de domínio (lógica de negócio)
- ✅ Factory methods para criação
- ❌ Sem dependências externas (frameworks, DB)

**Exemplo:**
```typescript
export class UserEntity {
  private _id: number;
  private _name: string;
  
  // Métodos de domínio
  isPartner(): boolean {
    return this._role === UserRole.PARTNER;
  }
  
  canReceiveCommission(): boolean {
    return this.isPartner();
  }
}
```

### 3. Camada de Infraestrutura (Infrastructure Layer)

**Localização:** `src/modules/{module}/infrastructure/`

**Responsabilidades:**
- Implementações concretas dos repositórios
- Comunicação com banco de dados (Prisma)
- Tipos de persistência intermediários
- Conversão de dados Prisma → Domínio

**Arquivos:**
```
infrastructure/
├── {entity}-repository.prisma.ts  # Implementação do repositório
└── types/
    └── {entity}-persistence.type.ts  # Tipos de persistência
```

**Exemplo:**
```typescript
// infrastructure/user-repository.prisma.ts
@Injectable()
export class UserRepositoryPrisma implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  
  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(this.mapPrismaToPersistence(user)) : null;
  }
  
  // Converte tipos Prisma para tipos intermediários
  private mapPrismaToPersistence(prismaUser: User): UserPersistence {
    return { /* ... */ };
  }
}
```

### 4. Camada de Aplicação (Application Layer)

**Localização:** `src/modules/{module}/`

**Componentes:**
- **Services:** Orquestram casos de uso
- **DTOs:** Data Transfer Objects
- **Controllers:** Adaptadores de entrada (HTTP)

**Características:**
- ✅ Services dependem de **interfaces** de repositório
- ✅ Injeção de dependência via tokens
- ✅ Não conhecem detalhes de implementação
- ✅ Coordenam fluxo de dados

**Exemplo:**
```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,  // Interface, não implementação!
  ) {}
}
```

### 5. Camada de Mapeamento (Mappers)

**Localização:** `src/modules/{module}/mappers/`

**Responsabilidades:**
- Converter dados de persistência → entidades de domínio
- Converter entidades de domínio → dados de persistência
- Isolar tipos do Prisma da camada de domínio

**Exemplo:**
```typescript
export class UserMapper {
  // Persistência → Domínio
  static toDomain(persistence: UserPersistence): UserEntity {
    return new UserEntity(/* ... */);
  }
  
  // Domínio → Persistência
  static toPersistence(entity: UserEntity): CreateUserPersistence {
    return { /* ... */ };
  }
}
```

## 🔄 Fluxo de Dados

```
┌──────────────┐
│  Controller  │  (HTTP/REST)
└──────┬───────┘
       │
       v
┌──────────────┐
│   Service    │  (Casos de Uso)
└──────┬───────┘
       │ (usa interface)
       v
┌──────────────────┐
│  IRepository     │  (Interface - Contrato)
└──────┬───────────┘
       │ (implementada por)
       v
┌──────────────────────┐
│ RepositoryPrisma     │  (Infraestrutura)
└──────┬───────────────┘
       │
       v
┌──────────────┐
│    Prisma    │  (ORM - Banco de Dados)
└──────────────┘

Retorno:
Prisma Data → Persistence Type → Mapper → Domain Entity → DTO → Response
```

## 🎯 Princípios SOLID Aplicados

### 1. **S - Single Responsibility Principle (SRP)**
- Cada classe tem uma única responsabilidade
- Entidades: lógica de domínio
- Repositories: acesso a dados
- Services: orquestração de casos de uso
- Mappers: conversão de dados

### 2. **O - Open/Closed Principle (OCP)**
- Código aberto para extensão, fechado para modificação
- Novas implementações de repository podem ser criadas sem alterar services

### 3. **L - Liskov Substitution Principle (LSP)**
- Qualquer implementação de IRepository pode substituir outra
- Services não quebram ao trocar implementações

### 4. **I - Interface Segregation Principle (ISP)**
- Interfaces específicas por contexto
- IUserRepository, IProductRepository, ISaleRepository

### 5. **D - Dependency Inversion Principle (DIP)**
- ✅ Services dependem de abstrações (interfaces)
- ✅ Implementações concretas dependem de abstrações
- ✅ Não há dependência direta de frameworks na camada de domínio

## 📦 Injeção de Dependência

### Configuração nos Módulos

```typescript
@Module({
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,  // Token (Symbol)
      useClass: UserRepositoryPrisma,  // Implementação concreta
    },
  ],
  exports: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryPrisma,
    },
  ],
})
export class UserModule {}
```

### Uso nos Services

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)  // Injeta usando o token
    private readonly userRepository: IUserRepository,  // Tipo: Interface
  ) {}
}
```

## 🧪 Vantagens para Testes

### Facilidade de Mock

```typescript
// Mock simples da interface
const mockUserRepository: IUserRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  // ...
};

// Teste unitário isolado
const userService = new UserService(mockUserRepository);
```

### Testes Isolados
- Services podem ser testados sem banco de dados
- Entidades podem ser testadas sem frameworks
- Lógica de domínio totalmente isolada

## 🔧 Alterações Realizadas

### 1. ✅ Criação de Enums de Domínio
- `UserRole` agora é do domínio, não do Prisma
- Localização: `domain/enums/user-role.enum.ts`

### 2. ✅ Interfaces de Repositório
- `IUserRepository`, `IProductRepository`, `ISaleRepository`
- Tokens para injeção de dependência
- Localização: `domain/interfaces/`

### 3. ✅ Tipos de Persistência Intermediários
- `UserPersistence`, `ProductPersistence`, `SalePersistence`
- Desacopla entidades do Prisma
- Localização: `infrastructure/types/`

### 4. ✅ Implementações de Repositório
- `UserRepositoryPrisma`, `ProductRepositoryPrisma`, `SaleRepositoryPrisma`
- Implementam interfaces da camada de domínio
- Isolam Prisma na camada de infraestrutura
- Localização: `infrastructure/`

### 5. ✅ Atualização de Mappers
- Usam tipos de persistência ao invés de tipos do Prisma
- Métodos `toDomain()` e `toPersistence()`

### 6. ✅ Atualização de Services
- Dependem de interfaces via `@Inject()`
- Não conhecem implementações concretas

### 7. ✅ Atualização de Módulos
- Configuração de DI com tokens
- Exportam interfaces, não implementações

## 📊 Estrutura de Diretórios Final

```
src/modules/users/
├── domain/
│   ├── enums/
│   │   └── user-role.enum.ts
│   └── interfaces/
│       └── user-repository.interface.ts
├── entities/
│   └── user.entity.ts
├── infrastructure/
│   ├── types/
│   │   └── user-persistence.type.ts
│   └── user-repository.prisma.ts
├── mappers/
│   └── user.mapper.ts
├── dto/
│   ├── create-user.dto.ts
│   └── user-response.dto.ts
├── user.controller.ts
├── user.service.ts
└── user.module.ts
```

## 🚀 Benefícios Alcançados

1. **Testabilidade:** Fácil criar mocks e testes isolados
2. **Manutenibilidade:** Código organizado e fácil de entender
3. **Flexibilidade:** Trocar ORM sem afetar domínio
4. **Escalabilidade:** Adicionar features sem quebrar código existente
5. **Clean Code:** Princípios SOLID aplicados
6. **Independência:** Domínio não depende de frameworks

## 🔄 Migrações Futuras Facilitadas

Com esta arquitetura, é fácil:
- ✅ Trocar Prisma por TypeORM, Sequelize, etc.
- ✅ Adicionar cache (Redis) na camada de infraestrutura
- ✅ Implementar Event Sourcing
- ✅ Adicionar múltiplas fontes de dados
- ✅ Criar testes unitários e de integração
- ✅ Implementar CQRS (Command Query Responsibility Segregation)

---

**Documentação criada em:** 30 de janeiro de 2026
**Padrão:** Clean Architecture + SOLID + DDD Tactical Patterns
