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

## Testes de Integração

O projeto possui **67 testes de integração** cobrindo 100% dos endpoints da API.

### Executar Testes

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

### Documentação de Testes

- [Resumo Completo](docs/TESTS-SUMMARY.md) - Visão geral dos 67 testes
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
├── tests/integration/      # Testes de integração (67 testes)
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
