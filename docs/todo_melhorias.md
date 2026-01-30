# 📋 TODO - Melhorias do Projeto

> Baseado no Code Review de 30/01/2026

---

## 🔴 URGENTE (1-2 dias)

### 1. Segurança - Autenticação e Autorização
- [ ] Implementar módulo de autenticação JWT
- [ ] Criar Guards para proteção de rotas
- [ ] Implementar autorização baseada em roles (ADMIN, PARTNER, CUSTOMER)
- [ ] Adicionar decoradores customizados (@Roles, @Public)
- [ ] Proteger endpoints sensíveis
- [ ] Implementar refresh token

**Arquivos afetados:**
- Criar: `src/auth/auth.module.ts`
- Criar: `src/auth/auth.service.ts`
- Criar: `src/auth/jwt.strategy.ts`
- Criar: `src/auth/guards/jwt-auth.guard.ts`
- Criar: `src/auth/guards/roles.guard.ts`
- Atualizar: todos os controllers

### 2. Segurança - Proteção de Credenciais
- [ ] Criar arquivo `.env.example` sem credenciais reais
- [ ] Remover credenciais sensíveis do `.env`
- [ ] Adicionar `.env` ao `.gitignore`
- [ ] Documentar variáveis de ambiente necessárias
- [ ] Usar secrets manager em produção
- [ ] Gerar JWT_SECRET forte

**Arquivos afetados:**
- Criar: `.env.example`
- Atualizar: `.gitignore`
- Atualizar: `docs/documentacao.md`

### 3. Exception Handling Global
- [ ] Criar HttpExceptionFilter customizado
- [ ] Adicionar tratamento específico para erros do Prisma
- [ ] Padronizar formato de resposta de erro
- [ ] Adicionar logger para erros
- [ ] Registrar filter globalmente no `main.ts`

**Arquivos afetados:**
- Criar: `src/common/filters/http-exception.filter.ts`
- Criar: `src/common/filters/prisma-exception.filter.ts`
- Atualizar: `src/main.ts`

### 4. Validação de Paginação
- [ ] Criar PaginationDto com validações
- [ ] Usar ParseIntPipe e DefaultValuePipe
- [ ] Validar valores mínimos e máximos
- [ ] Adicionar limite máximo de itens por página
- [ ] Aplicar em todos os endpoints paginados

**Arquivos afetados:**
- Criar: `src/common/dto/pagination.dto.ts`
- Atualizar: `src/modules/users/user.controller.ts`
- Atualizar: `src/modules/products/product.controller.ts`
- Atualizar: `src/modules/sales/sale.controller.ts`

### 5. CORS Configuration
- [ ] Configurar CORS com origins específicos
- [ ] Adicionar `ALLOWED_ORIGINS` ao `.env`
- [ ] Configurar credentials corretamente
- [ ] Documentar configuração de CORS

**Arquivos afetados:**
- Atualizar: `src/main.ts`
- Atualizar: `.env.example`

---

## 🟡 IMPORTANTE (1 semana)

### 6. Cobertura de Testes
- [ ] Criar testes unitários para ProductService
- [ ] Criar testes unitários para SaleService
- [ ] Criar testes unitários para PartnerService
- [ ] Criar testes unitários para ReportService
- [ ] Criar testes E2E para todos os endpoints
- [ ] Configurar coverage mínimo (80%)
- [ ] Adicionar testes de integração com banco

**Arquivos afetados:**
- Criar: `src/modules/products/product.service.spec.ts`
- Criar: `src/modules/sales/sale.service.spec.ts`
- Criar: `src/modules/partners/partner.service.spec.ts`
- Criar: `src/modules/reports/report.service.spec.ts`
- Criar: `test/users.e2e-spec.ts`
- Criar: `test/products.e2e-spec.ts`
- Criar: `test/sales.e2e-spec.ts`
- Atualizar: `package.json` (coverage threshold)

### 7. Rate Limiting
- [ ] Instalar `@nestjs/throttler`
- [ ] Configurar ThrottlerModule
- [ ] Aplicar Guards de rate limiting
- [ ] Configurar limites por endpoint
- [ ] Adicionar bypass para IPs confiáveis

**Arquivos afetados:**
- Atualizar: `package.json`
- Atualizar: `src/app.module.ts`
- Atualizar: `src/main.ts`

### 8. Dockerfile para Produção
- [ ] Criar multi-stage build
- [ ] Separar builder e runtime
- [ ] Otimizar node_modules (npm ci)
- [ ] Usar build ao invés de start:dev
- [ ] Adicionar non-root user
- [ ] Minimizar tamanho da imagem

**Arquivos afetados:**
- Atualizar: `Dockerfile`
- Criar: `.dockerignore`

### 9. Validação de Datas
- [ ] Criar DTO para filtros de relatório
- [ ] Adicionar @IsDateString()
- [ ] Validar startDate < endDate
- [ ] Adicionar validação de formato ISO 8601
- [ ] Tratar Invalid Date

**Arquivos afetados:**
- Criar: `src/modules/reports/dto/sales-report-query.dto.ts`
- Atualizar: `src/modules/reports/report.controller.ts`
- Atualizar: `src/modules/reports/report.service.ts`

### 10. Helper Genérico de Paginação
- [ ] Criar interface PaginatedResult<T>
- [ ] Criar classe PaginationHelper
- [ ] Remover código duplicado de paginação
- [ ] Aplicar em todos os services
- [ ] Adicionar metadata de paginação

**Arquivos afetados:**
- Criar: `src/common/interfaces/paginated-result.interface.ts`
- Criar: `src/common/helpers/pagination.helper.ts`
- Atualizar: `src/modules/users/user.service.ts`
- Atualizar: `src/modules/products/product.service.ts`
- Atualizar: `src/modules/sales/sale.service.ts`

---

## 🟢 DESEJÁVEL (2+ semanas)

### 11. TypeScript Strict Mode
- [ ] Habilitar `noImplicitAny: true`
- [ ] Habilitar `strictBindCallApply: true`
- [ ] Habilitar `noFallthroughCasesInSwitch: true`
- [ ] Habilitar `strictPropertyInitialization: true`
- [ ] Corrigir todos os erros de tipo
- [ ] Remover todos os `any` explícitos

**Arquivos afetados:**
- Atualizar: `tsconfig.json`
- Atualizar: múltiplos arquivos `.ts`

### 12. Soft Deletes
- [ ] Adicionar campo `deletedAt` ao schema
- [ ] Criar migration para adicionar campo
- [ ] Implementar método `softDelete` nos repositories
- [ ] Filtrar registros deletados nas queries
- [ ] Adicionar endpoint de restauração
- [ ] Adicionar query param `includeDeleted`

**Arquivos afetados:**
- Atualizar: `prisma/schema.prisma`
- Criar: nova migration
- Atualizar: todos os repositories
- Atualizar: todos os services

### 13. Logging Profissional
- [ ] Substituir `console.log` por Logger do NestJS
- [ ] Configurar níveis de log por ambiente
- [ ] Adicionar context aos logs
- [ ] Implementar log rotation
- [ ] Integrar com serviço externo (Winston, Pino)
- [ ] Adicionar correlation ID

**Arquivos afetados:**
- Atualizar: `src/main.ts`
- Atualizar: `src/database/prisma.service.ts`
- Criar: `src/common/interceptors/logging.interceptor.ts`

### 14. Healthcheck Endpoint
- [ ] Criar endpoint `/health`
- [ ] Verificar conexão com banco
- [ ] Verificar status da aplicação
- [ ] Adicionar métricas básicas
- [ ] Retornar versão da API
- [ ] Implementar `/health/ready` e `/health/live`

**Arquivos afetados:**
- Atualizar: `src/app.controller.ts`
- Criar: `src/health/health.module.ts`
- Criar: `src/health/health.controller.ts`

### 15. ESLint Rules Rigorosas
- [ ] Mudar `no-explicit-any` para 'error'
- [ ] Mudar `no-floating-promises` para 'error'
- [ ] Adicionar `no-unused-vars` error
- [ ] Adicionar `prefer-const`
- [ ] Configurar Prettier com regras mais rígidas
- [ ] Corrigir todos os warnings

**Arquivos afetados:**
- Atualizar: `eslint.config.mjs`
- Atualizar: múltiplos arquivos `.ts`

### 16. Variáveis de Ambiente Centralizadas
- [ ] Criar ConfigService tipado
- [ ] Validar todas as env vars no startup
- [ ] Criar interface de configuração
- [ ] Remover valores hardcoded
- [ ] Mover taxa de comissão para .env
- [ ] Documentar todas as variáveis

**Arquivos afetados:**
- Criar: `src/config/configuration.ts`
- Criar: `src/config/env.validation.ts`
- Atualizar: `src/app.module.ts`
- Atualizar: `src/modules/partners/partner.service.ts`

### 17. Observabilidade e Métricas
- [ ] Adicionar Prometheus metrics
- [ ] Implementar tracing distribuído
- [ ] Configurar APM (Application Performance Monitoring)
- [ ] Adicionar dashboards
- [ ] Configurar alertas
- [ ] Implementar audit logs

**Arquivos afetados:**
- Criar: `src/common/interceptors/metrics.interceptor.ts`
- Atualizar: `src/app.module.ts`

### 18. Validação de Preço
- [ ] Corrigir mensagem de erro do @Min
- [ ] Usar @Min(0.01) ou ajustar mensagem
- [ ] Adicionar @Max para limite superior
- [ ] Validar casas decimais (2 dígitos)
- [ ] Adicionar formatação de moeda

**Arquivos afetados:**
- Atualizar: `src/modules/products/dto/create-product.dto.ts`

### 19. Cache Layer
- [ ] Configurar Redis
- [ ] Implementar cache para produtos
- [ ] Implementar cache para usuários
- [ ] Configurar TTL adequado
- [ ] Implementar invalidação de cache
- [ ] Adicionar CacheInterceptor

**Arquivos afetados:**
- Atualizar: `docker-compose.yml`
- Criar: `src/cache/cache.module.ts`
- Atualizar: múltiplos services

### 20. API Versioning
- [ ] Implementar versionamento de API
- [ ] Criar v1 como versão atual
- [ ] Preparar estrutura para v2
- [ ] Documentar estratégia de versionamento
- [ ] Atualizar Swagger para múltiplas versões

**Arquivos afetados:**
- Atualizar: `src/main.ts`
- Reestruturar: controllers e modules

---

## 📚 DOCUMENTAÇÃO

### 21. Documentação Técnica
- [ ] Documentar arquitetura do sistema
- [ ] Criar diagramas de relacionamento
- [ ] Documentar fluxos de autenticação
- [ ] Criar guia de contribuição
- [ ] Documentar processo de deploy
- [ ] Criar ADRs (Architecture Decision Records)

**Arquivos afetados:**
- Criar: `docs/architecture.md`
- Criar: `docs/contributing.md`
- Criar: `docs/deployment.md`
- Atualizar: `README.md`

### 22. Postman Collection
- [ ] Criar collection do Postman
- [ ] Adicionar todos os endpoints
- [ ] Configurar variáveis de ambiente
- [ ] Adicionar testes automáticos
- [ ] Documentar exemplos de uso

**Arquivos afetados:**
- Criar: `docs/postman/marketplace.postman_collection.json`

---

## 🎯 PERFORMANCE

### 23. Database Optimization
- [ ] Adicionar índices no banco
- [ ] Otimizar queries N+1
- [ ] Implementar eager/lazy loading adequado
- [ ] Adicionar índices compostos
- [ ] Analisar query performance

**Arquivos afetados:**
- Atualizar: `prisma/schema.prisma`
- Criar: novas migrations

### 24. Pagination Optimization
- [ ] Implementar cursor-based pagination
- [ ] Adicionar opção de scroll infinito
- [ ] Otimizar count queries
- [ ] Implementar query caching

**Arquivos afetados:**
- Atualizar: todos os repositories
- Atualizar: helpers de paginação

---

## 🔄 REFATORAÇÃO

### 25. Code Quality
- [ ] Remover código duplicado
- [ ] Simplificar lógica complexa
- [ ] Melhorar nomenclatura
- [ ] Adicionar comentários em código complexo
- [ ] Aplicar design patterns onde apropriado

**Arquivos afetados:**
- Múltiplos arquivos

---

## ✅ Progresso

- **Total de tarefas:** 25 grupos
- **Concluídas:** 0
- **Em andamento:** 0
- **Pendentes:** 25

---

## 📝 Notas

### Ordem Recomendada de Implementação:
1. **Segurança primeiro** (itens 1-2)
2. **Estabilidade** (itens 3-5)
3. **Qualidade** (itens 6-10)
4. **Manutenibilidade** (itens 11-20)
5. **Documentação e Performance** (itens 21-25)

### Estimativa de Tempo:
- **Sprint 1 (Urgente):** ~40h
- **Sprint 2 (Importante):** ~60h
- **Sprint 3 (Desejável):** ~80h
- **Total:** ~180h (aproximadamente 4-5 semanas)

---

**Última atualização:** 30/01/2026
**Responsável:** Equipe de Desenvolvimento
**Status:** Aguardando aprovação para início
