# Testes de Integração - DoaCin 🩸

## Slide 1: Arquitetura de Testes

### 🏗️ Estrutura Implementada

```
tests/integration/
├── setup.js          → Configuração global
├── helpers.js        → Funções auxiliares
├── testApp.js        → Aplicação isolada
├── auth.test.js      → Autenticação (5 testes)
├── dashboard.test.js → Dashboard (11 testes)
├── donations.test.js → Doações (15 testes)
├── campaigns.test.js → Campanhas (17 testes)
├── user.test.js      → Usuários (17 testes)
└── basic.test.js     → Health checks (2 testes)
```

### 🔧 Stack Técnica

- **Vitest** - Framework de testes
- **Supertest** - HTTP assertions
- **Docker** - Banco de dados isolado (PostgreSQL)
- **Prisma** - ORM para controle de dados

#### Aspectos Validados nos Módulos:

1. **Autenticação & Autorização**
   - Token JWT obrigatório
   - Validação de token inválido
   - Status 401 para não autenticados

2. **Isolamento de Dados**
   - Usuário A não acessa dados do usuário B
   - Transações isoladas

3. **Validação de Entrada**
   - Campos obrigatórios
   - Tipos de dados corretos
   - Formatos esperados

4. **Qualidade de Resposta**
   - Estrutura consistente
   - Campos esperados pelo frontend
   - Tipos corretos

---

## Slide 2: Ambiente Isolado

### 🐳 Docker para Testes

```yaml
postgres-test:
  image: postgres:15-alpine
  port: 5433 (diferente da porta de produção)
  database: doacin_test
```

### ✅ Benefícios

- **Isolamento completo** - não afeta banco de produção
- **Reprodutibilidade** - mesmas condições em qualquer máquina
- **Paralelização** - múltiplos testes independentes
- **Limpeza automática** - estado resetado entre testes

## Slide 3: Automação

### ⚙️ Scripts Implementados

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage",
  "test:setup": "scripts/run-tests.ps1",
  "test:cleanup": "scripts/cleanup-tests.ps1"
}
```

## Slide 4: Conclusão

### ✨ Resultados Entregues

- **67 testes de integração** cobrindo fluxos críticos
- **Ambiente isolado** com Docker
- **Automação completa** (setup em 1 comando)
- **Documentação detalhada** para toda a equipe
- **100% de aprovação** em todos os testes

### 💡 Impacto no Projeto

- Maior **confiança** nas entregas
- **Redução de bugs** em produção
- **Facilita refatoração** e manutenção
- Base sólida para **crescimento** do projeto


