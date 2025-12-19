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

---

## Slide 4: Módulo de Autenticação

### 🔐 Auth Tests (5 testes)

#### Funcionalidades Testadas:

1. ✅ **Registro de novo usuário**
   - Validação de dados obrigatórios
   - Criptografia de senha (bcrypt)
   - Geração de token JWT

2. ✅ **Prevenção de duplicatas**
   - Email único no sistema

3. ✅ **Login com credenciais válidas**
   - Autenticação bem-sucedida
   - Token retornado

4. ✅ **Validação de credenciais**
   - Senha incorreta
   - Email não cadastrado

---

## Slide 5: Módulo Dashboard

### 📈 Dashboard Tests (11 testes)

#### Estatísticas Testadas:

- **Saldo de Capibas** - sistema de pontos
- **Contagem de doações** (último ano)
- **Data da última doação**
- **Doações pendentes** de confirmação

#### Segurança:

- ✅ Autenticação obrigatória (401)
- ✅ Validação de token
- ✅ Isolamento entre usuários

#### Qualidade:

- ✅ Todos os campos esperados pelo frontend
- ✅ Tipos de dados corretos

---

## Slide 6: Módulo de Doações

### 💉 Donations Tests (15 testes)

#### Funcionalidades:

1. **Histórico de Doações**
   - Listagem completa
   - Array vazio para novos usuários

2. **Criação Manual de Doações**
   - Registro de doação passada
   - Criação automática de ponto de coleta
   - Validação de campos obrigatórios

3. **Confirmação via QR Code**
   - Confirma doação pendente
   - Valida a mais recente
   - Verifica disponibilidade

#### Segurança:

- ✅ Isolamento: usuário só acessa suas doações
- ✅ Autenticação em todas as rotas

---

## Slide 7: Módulo de Campanhas

### 📍 Campaigns Tests (17 testes)

#### Gestão de Locais de Coleta:

1. **Listagem de Locais**
   - Locais fixos (hemocentros)
   - Locais móveis (eventos)
   - Ordenação por nome
   - Filtros disponíveis

2. **Criação de Locais**
   - Locais fixos com horários
   - Eventos móveis com datas
   - Campos opcionais (coordenadas, contato)

#### Validações:

- ✅ Campos obrigatórios (nome, endereço)
- ✅ Formato de dados (horários, coordenadas)
- ✅ Tipos corretos na resposta

---

## Slide 8: Módulo de Usuários

### 👤 User Tests (17 testes)

#### Atualização de Perfil:

- **Telefone**
- **Tipo sanguíneo** (A+, O-, etc.)
- **Peso** (validação > 50kg)
- **Gênero**
- **Data de nascimento** (DD/MM/YYYY)

#### Funcionalidades Avançadas:

- ✅ Atualização múltiplos campos simultâneos
- ✅ Aceitação de campos vazios/null
- ✅ Conversão de tipos (string → número)
- ✅ Validação de formatos

#### Segurança:

- ✅ Isolamento: não altera dados de outros usuários
- ✅ Autenticação obrigatória

---

## Slide 10: Automação

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

## Slide 17: Conclusão

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


