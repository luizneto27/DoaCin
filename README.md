# DoaCin

**Plataforma de gamificação para doação de sangue**

Sistema completo de incentivo à doação de sangue com gamificação, rastreamento de doações e integração com o Conecta Recife.

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- Docker Desktop
- PostgreSQL (via Docker)

### Setup Inicial

```bash
# 1. Iniciar Docker Desktop

# 2. Subir banco de dados
docker-compose up -d

# 3. Instalar dependências
npm install
npm install -D tsx

# 4. Configurar banco de dados
npx prisma migrate deploy
npx prisma generate
npx prisma db seed

# 5. Iniciar aplicação
npm run dev
```

### Ferramentas Auxiliares

```bash
# Prisma Studio (interface visual do banco)
npx prisma studio

# Modo de desenvolvimento (frontend + backend)
npm run dev
```

---

## Testes

O projeto possui **98 testes** divididos em duas categorias:

### Testes de Integração (67 testes)

Testam o fluxo completo da aplicação com banco de dados real.

**Executar Testes:**

```bash
# Setup completo (Docker + Migrations + Testes)
npm run test:setup

# Apenas executar testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Interface visual
npm run test:ui

# Cobertura de código
npm run test:coverage
```

**Requisitos:** Docker Desktop rodando (banco PostgreSQL)

### Testes Unitários (31 testes)

Testam funções isoladas dos controllers usando mocks.

**Executar Testes:**

```bash
# Executar todos os testes unitários
npm run test:unit

# Modo watch (re-executa ao salvar)
npm run test:unit:watch

# Cobertura de código
npm run test:unit:coverage
```

**Requisitos:** Nenhum (não precisa de banco de dados)

### Executar Todos os Testes

```bash
npm run test:unit && npm test
```

### Documentação de Testes

- [Resumo Completo](docs/TESTS-SUMMARY.md) - Visão geral dos testes de integração
- [Início Rápido](docs/QUICK-START-TESTS.md) - Comandos essenciais
- [Guia Docker](docs/DOCKER-TESTS.md) - Configuração detalhada
- [Troubleshooting](docs/TROUBLESHOOTING-TESTS.md) - Resolução de problemas

---

## Estrutura do Projeto

```
DoaCin/
├── src/                    # Frontend React
│   ├── pages/             # Páginas da aplicação
│   ├── components/        # Componentes reutilizáveis
│   └── context/           # Context API (Auth, Dashboard)
├── routes/                 # Backend Express
│   ├── auth.js            # Autenticação
│   ├── dashboard.js       # Estatísticas
│   ├── donations.js       # Gestão de doações
│   ├── campaigns.js       # Locais de campanha
│   └── user.js            # Perfil do usuário
├── tests/
│   ├── integration/       # Testes de integração (67 testes)
│   └── unit/              # Testes unitários (31 testes)
├── prisma/                 # Schema e migrations
└── docs/                   # Documentação completa
```

---

## Tecnologias

### Backend

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Bcrypt

### Frontend

- React + Vite
- React Router
- Context API

### Testes

- Vitest (67 testes)
- Supertest
- Docker PostgreSQL

---

## Documentação

- **API**: Todos os endpoints documentados em `docs/`
- **Testes**: Documentação completa em `docs/TESTS-SUMMARY.md`
- **Docker**: Guia de configuração em `docs/DOCKER-TESTS.md`

---

## Equipe

Projeto desenvolvido pela equipe DoaCin - 2025
