# Respostas - Capítulo 7: Arquitetura (Parte 1) aplicada ao DoaCin

## Capítulo 7: Arquitetura

### 7.1 Arquitetura Monolítica

#### Definição de Arquitetura Monolítica

**Arquitetura Monolítica** é um estilo arquitetural onde todos os componentes de uma aplicação (interface de usuário, lógica de negócio, acesso a dados) são desenvolvidos, implantados e executados como uma **única unidade indivisível**.

#### Características Fundamentais

**1. Unidade de Implantação Única:**
- Todo o sistema é empacotado e implantado como um único artefato
- Impossível implantar partes do sistema independentemente
- Uma mudança pequena requer deploy do sistema inteiro

**2. Base de Código Unificada:**
- Todo o código-fonte está em um único repositório
- Mesma linguagem/tecnologia principal
- Dependências compartilhadas

**3. Banco de Dados Único:**
- Todos os módulos compartilham o mesmo banco de dados
- Esquema centralizado
- Transações distribuídas internamente

**4. Acoplamento Forte:**
- Componentes são fortemente acoplados
- Chamadas de função diretas (em memória)
- Difícil isolar funcionalidades

**5. Escala Vertical:**
- Sistema escala como um todo (não por componente)
- Requer mais CPU/RAM no mesmo servidor
- Não permite escala horizontal granular

#### Estrutura Típica de um Monólito

```
┌─────────────────────────────────────┐
│     APLICAÇÃO MONOLÍTICA            │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Camada de Apresentação     │  │
│  │   (UI / Frontend)            │  │
│  └──────────────────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │   Camada de Lógica           │  │
│  │   (Business Logic / API)     │  │
│  └──────────────────────────────┘  │
│               ↓                     │
│  ┌──────────────────────────────┐  │
│  │   Camada de Dados            │  │
│  │   (Database Access / ORM)    │  │
│  └──────────────────────────────┘  │
│               ↓                     │
│        ┌──────────┐                │
│        │   DB     │                │
│        └──────────┘                │
│                                     │
│  Deploy: Um único executável        │
│  Processo: node server.js           │
└─────────────────────────────────────┘
```

#### Tipos de Monólitos

**1. Monólito Puro (Big Mud Ball):**
- Sem separação clara de responsabilidades
- Código espaguete
- Difícil manutenção

**2. Monólito Modular (Modular Monolith):**
- Organizado em módulos internos
- Separação lógica clara
- Acoplamento baixo entre módulos
- **Melhor prática** antes de microservices

**3. Monólito Distribuído (Anti-pattern):**
- Pior de ambos os mundos
- Múltiplos serviços fortemente acoplados
- Deve ser evitado

#### Vantagens da Arquitetura Monolítica

| Vantagem | Descrição | Benefício |
|----------|-----------|-----------|
| **Simplicidade** | Toda a aplicação em um lugar | Fácil de entender para novos devs |
| **Desenvolvimento Rápido** | Sem overhead de comunicação entre serviços | Ideal para MVPs e startups |
| **Deploy Simples** | Um único artefato para implantar | Menos complexidade de DevOps |
| **Debugging Facilitado** | Stack traces completos | Rastreamento end-to-end trivial |
| **Transações ACID** | Transações nativas do banco | Consistência garantida |
| **Performance** | Chamadas in-process (sem rede) | Latência mínima |
| **Testabilidade** | Testes integrados mais fáceis | Ambiente de teste simplificado |
| **Tooling** | IDEs funcionam melhor | Refactoring, autocomplete |
| **Custo Operacional** | Um servidor, um banco | Infraestrutura mais barata |

#### Desvantagens da Arquitetura Monolítica

| Desvantagem | Descrição | Impacto |
|-------------|-----------|---------|
| **Escala Limitada** | Não escala componentes independentemente | Desperdício de recursos |
| **Deploy Arriscado** | Todo o sistema sai do ar | Alto risco em produção |
| **Tempo de Build** | Compilação lenta em sistemas grandes | Produtividade reduzida |
| **Acoplamento Tecnológico** | Preso a uma stack | Difícil adotar novas tecnologias |
| **Barreira de Entrada** | Código grande intimida novos devs | Onboarding lento |
| **Equipes Dependentes** | Conflitos de merge frequentes | Coordenação necessária |
| **Falha Total** | Um bug pode derrubar tudo | Resiliência baixa |
| **Crescimento Não Linear** | Complexidade cresce exponencialmente | Manutenção cara |

#### O DoaCin é um Monólito?

**Resposta: SIM, o DoaCin possui uma arquitetura monolítica modular.**

##### Evidências de Arquitetura Monolítica no DoaCin

**1. Unidade de Implantação Única**

```bash
# package.json - Um único projeto
{
  "name": "doacin",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"vite\"",
    "server": "nodemon server.js",
    "build": "vite build"
  }
}

# Deploy simultâneo:
# - Backend (Express) e Frontend (React) no mesmo projeto
# - Um único repositório Git
# - Deploy conjunto (não independente)
```

**Estrutura do Projeto:**
```
DoaCin/
├── server.js              ← Backend (Express)
├── src/                   ← Frontend (React)
├── routes/                ← API Routes
├── services/              ← Business Logic
├── config/                ← Configuration
├── prisma/                ← Database Schema
└── package.json           ← Dependências únicas
```

**2. Banco de Dados Único e Compartilhado**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: doacin-db    # UM único banco
    environment:
      POSTGRES_DB: doacin_db     # UM schema
    ports:
      - "5432:5432"              # UMA porta

# Todos os módulos acessam o mesmo PostgreSQL:
# - Autenticação usa tabela 'User'
# - Doações usam tabela 'Donation'
# - Campanhas usam tabela 'PontoColeta'
# - Todos no MESMO banco de dados
```

```prisma
// prisma/schema.prisma - Schema unificado

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // UM único banco
}

model User { ... }
model Donation { ... }
model PontoColeta { ... }
model Agendamento { ... }
model Quiz { ... }

// Todos os modelos no mesmo banco
// Relacionamentos nativos (foreign keys)
```

**3. Processo Único em Execução**

```javascript
// server.js - Ponto de entrada único

import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

// Todas as rotas montadas no mesmo processo
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigns", campaignsRoutes);
app.use('/api/user', userRoutes);

// UM único servidor escutando
app.listen(PORT, async () => {
  console.log(`Backend Express rodando na porta ${PORT}`);
  await conectaService.initialize();
});

// Resultado:
// - Um único processo Node.js
// - Todas as funcionalidades no mesmo container
// - Memória compartilhada
```

**4. Frontend e Backend Acoplados**

```javascript
// vite.config.js - Proxy integrado

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Backend local
        changeOrigin: true,
      }
    }
  }
})

// Frontend (Vite:5173) → Proxy → Backend (Express:3000)
// Desenvolvimento integrado
// Deploy conjunto
```

**5. Dependências Compartilhadas**

```json
// package.json - Dependências unificadas

{
  "dependencies": {
    // Backend:
    "express": "^5.1.0",
    "@prisma/client": "^6.18.0",
    "jsonwebtoken": "^9.0.2",
    
    // Frontend:
    "react": "^19.1.1",
    "react-router-dom": "^7.9.5",
    "leaflet": "^1.9.4",
    
    // Compartilhadas:
    "axios": "^1.13.2"
  }
}

// PROBLEMA TÍPICO DE MONÓLITO:
// - Atualizar React afeta build do backend
// - Conflitos de versões (ex: ESLint)
// - node_modules gigantesco
```

**6. Acoplamento de Código**

```javascript
// Exemplo de acoplamento típico de monólito:

// Frontend: src/pages/DonationsPage.jsx
import { authFetch } from '../../services/api.js';

const response = await authFetch('/api/donations');
// ↓ Chama diretamente o backend (mesma aplicação)

// Backend: routes/donations.js
router.get('/', authMiddleware, getDonationHistory);
// ↓ Usa middleware compartilhado

// Controller: routes/controllers/donationsController.js
import prisma from '../../config/database.js';
// ↓ Acessa banco diretamente (mesma instância Singleton)

// Tudo no mesmo processo, mesma memória
```

##### Análise Detalhada: DoaCin como Monólito Modular

O DoaCin NÃO é um "big ball of mud". É um **monólito modular bem estruturado**:

```
┌────────────────────────────────────────────────────┐
│              DoaCin - Monólito Modular             │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │   MÓDULO FRONTEND (React SPA)              │  │
│  │                                             │  │
│  │  src/                                       │  │
│  │  ├── pages/      (HomePage, DonationsPage) │  │
│  │  ├── components/ (StatCard, LocalCard)     │  │
│  │  ├── context/    (AuthContext, Dashboard)  │  │
│  │  └── services/   (api.js - authFetch)      │  │
│  └─────────────────────────────────────────────┘  │
│                       ↓ HTTP                       │
│  ┌─────────────────────────────────────────────┐  │
│  │   MÓDULO BACKEND (Express REST API)        │  │
│  │                                             │  │
│  │  server.js                                  │  │
│  │  ├── routes/                                │  │
│  │  │   ├── auth.js      (Módulo Autenticação)│  │
│  │  │   ├── donations.js (Módulo Doações)     │  │
│  │  │   └── campaigns.js (Módulo Campanhas)   │  │
│  │  └── services/                              │  │
│  │      └── conectaService.js (Integração)    │  │
│  └─────────────────────────────────────────────┘  │
│                       ↓ Prisma ORM                 │
│  ┌─────────────────────────────────────────────┐  │
│  │   MÓDULO DADOS (Prisma Client)             │  │
│  │                                             │  │
│  │  config/database.js (Singleton)             │  │
│  │  prisma/schema.prisma                       │  │
│  └─────────────────────────────────────────────┘  │
│                       ↓ SQL                        │
│             ┌────────────────────┐                │
│             │   PostgreSQL DB    │                │
│             │   (Container)      │                │
│             └────────────────────┘                │
│                                                    │
│  CARACTERÍSTICAS MODULARES:                       │
│  ✓ Separação clara (routes/controllers/services)  │
│  ✓ Baixo acoplamento entre módulos                │
│  ✓ Alta coesão dentro de cada módulo              │
│  ✗ MAS: Deploy conjunto obrigatório               │
│  ✗ MAS: Banco de dados compartilhado              │
└────────────────────────────────────────────────────┘
```

##### Comparação: DoaCin vs Microservices

| Aspecto | DoaCin (Monólito) | Microservices |
|---------|-------------------|---------------|
| **Deploy** | Um comando (`npm run dev`) | Múltiplos deploys independentes |
| **Repositório** | Um único (monorepo) | Múltiplos repos ou monorepo |
| **Banco de Dados** | PostgreSQL único | DB por serviço (padrão) |
| **Comunicação** | Chamadas de função | HTTP/gRPC/Message Queue |
| **Transações** | ACID nativo | Saga pattern (eventual consistency) |
| **Escala** | Horizontal (toda app) | Horizontal por serviço |
| **Tecnologia** | Node.js + React | Polyglot (Java, Go, Python...) |
| **Complexidade** | Baixa | Alta (orquestração) |
| **Latência** | Muito baixa | Maior (chamadas de rede) |
| **Falhas** | Cascata (total) | Isoladas (circuit breaker) |

**Se DoaCin fosse Microservices:**

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │      │   Auth      │      │  Donations  │
│  Service    │──────│  Service    │──────│  Service    │
│  (React)    │ HTTP │  (Node.js)  │ HTTP │  (Node.js)  │
│  Port: 3000 │      │  Port: 4001 │      │  Port: 4002 │
└─────────────┘      └──────┬──────┘      └──────┬──────┘
                            │                     │
                       ┌────▼────┐          ┌─────▼─────┐
                       │ Auth DB │          │ Donor DB  │
                       │ (Postgres)│        │ (Postgres)│
                       └─────────┘          └───────────┘

┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Campaigns   │      │  Dashboard  │      │   Quiz      │
│ Service     │──────│  Service    │──────│  Service    │
│ (Node.js)   │ HTTP │  (Node.js)  │ HTTP │  (Node.js)  │
│ Port: 4003  │      │  Port: 4004 │      │  Port: 4005 │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                     │
  ┌────▼─────┐         ┌────▼─────┐        ┌─────▼─────┐
  │ Camps DB │         │ Stats DB │        │ Quiz DB   │
  │(Postgres)│         │(Postgres)│        │(Postgres) │
  └──────────┘         └──────────┘        └───────────┘

# Complexidade aumentada:
- 6 serviços independentes
- 6 bancos de dados separados
- API Gateway necessário
- Service Discovery (Consul/Eureka)
- Orquestração (Kubernetes)
- Monitoramento distribuído (Jaeger)
```

##### Por que DoaCin é Monólito e não Microservices?

**Decisão Correta para o Contexto:**

| Fator | Justificativa |
|-------|---------------|
| **Tamanho da Equipe** | Pequena (1-3 devs acadêmicos) → Monólito é adequado |
| **Escala de Usuários** | Baixa/Média (projeto acadêmico) → Não precisa de microservices |
| **Complexidade de Domínio** | Moderada → Monólito modular suficiente |
| **Velocidade de Desenvolvimento** | MVP rápido → Monólito é mais ágil |
| **Maturidade da Equipe** | Junior/Intermediário → Microservices prematuros |
| **Infraestrutura** | Limitada (Docker local) → Monólito mais simples |
| **Requisitos de Disponibilidade** | 99% suficiente → Não precisa de resiliência extrema |

**Regra de Ouro de Martin Fowler:**
> "Não comece com microservices. Comece com um monólito modular e migre para microservices apenas quando a dor justificar a complexidade adicional."

##### Quando o DoaCin Deveria Migrar para Microservices?

**Sinais de que é hora:**

1. ✗ **Equipe > 10 desenvolvedores** (não é o caso)
2. ✗ **Deploy > 1 vez/dia** (não é o caso)
3. ✗ **Módulos com escalas diferentes** (ex: quiz tem 100x mais uso que auth)
4. ✗ **Tecnologias incompatíveis** (ex: IA em Python, backend em Node)
5. ✗ **Tempo de build > 20 minutos** (não é o caso)
6. ✗ **Falhas em cascata** (um módulo derruba todos)

**Atualmente o DoaCin NÃO precisa de microservices.**

---

### 7.2 Arquitetura em Camadas (Layered Architecture)

#### Definição de Arquitetura em Camadas

**Arquitetura em Camadas** (também chamada de N-Tier Architecture) é um padrão arquitetural que organiza o sistema em camadas horizontais, onde cada camada tem uma responsabilidade específica e só pode comunicar-se com camadas adjacentes.

#### Princípios Fundamentais

**1. Separação de Responsabilidades (SoC):**
- Cada camada tem uma única responsabilidade bem definida
- Mudanças em uma camada não afetam outras

**2. Dependência Unidirecional:**
- Camadas superiores dependem de camadas inferiores
- Camadas inferiores NÃO conhecem camadas superiores

**3. Abstração:**
- Cada camada expõe uma interface abstrata
- Implementação interna é escondida

#### Estrutura Clássica (4 Camadas)

```
┌─────────────────────────────────────────────────┐
│         CAMADA DE APRESENTAÇÃO                  │
│         (Presentation Layer)                    │
│                                                 │
│  Responsabilidade: Interface com usuário        │
│  Tecnologias: React, Angular, Vue, HTML/CSS     │
│  Exemplos: Páginas, componentes, formulários    │
└─────────────────────────────────────────────────┘
                      ↓ Apenas
┌─────────────────────────────────────────────────┐
│         CAMADA DE APLICAÇÃO                     │
│         (Application Layer / API Layer)         │
│                                                 │
│  Responsabilidade: Lógica de coordenação        │
│  Tecnologias: Express, NestJS, REST/GraphQL     │
│  Exemplos: Rotas, controllers, middlewares      │
└─────────────────────────────────────────────────┘
                      ↓ Apenas
┌─────────────────────────────────────────────────┐
│         CAMADA DE NEGÓCIO                       │
│         (Business Logic Layer / Domain Layer)   │
│                                                 │
│  Responsabilidade: Regras de negócio            │
│  Tecnologias: Classes de serviço, validações    │
│  Exemplos: Cálculos, validações, workflows      │
└─────────────────────────────────────────────────┘
                      ↓ Apenas
┌─────────────────────────────────────────────────┐
│         CAMADA DE DADOS                         │
│         (Data Access Layer / Persistence)       │
│                                                 │
│  Responsabilidade: Acesso a dados               │
│  Tecnologias: Prisma, TypeORM, SQL              │
│  Exemplos: Repositories, queries, migrations    │
└─────────────────────────────────────────────────┘
                      ↓
                ┌──────────┐
                │ Database │
                └──────────┘
```

#### Variações da Arquitetura em Camadas

**1. Camadas Abertas (Open Layers):**
- Camadas superiores podem pular camadas intermediárias
- Mais flexível, mas menos isolamento
- Exemplo: Apresentação → Dados (pula Negócio)

**2. Camadas Fechadas (Closed Layers):**
- **Obrigatório** passar por todas as camadas
- Mais rígido, mas melhor isolamento
- **Recomendado** para manutenibilidade

**3. Camadas com Crosscutting Concerns:**
```
┌─────────────────────────────────────────┐
│          Apresentação                   │
├─────────────────────────────────────────┤
│          Aplicação                      │
├─────────────────────────────────────────┤
│          Negócio                        │
├─────────────────────────────────────────┤
│          Dados                          │
└─────────────────────────────────────────┘
    ↑           ↑          ↑
    │           │          │
    └───────────┴──────────┘
    Logging, Security, Caching
    (Aspectos Transversais)
```

#### Vantagens da Arquitetura em Camadas

| Vantagem | Descrição |
|----------|-----------|
| **Organização Clara** | Código bem estruturado e previsível |
| **Manutenibilidade** | Mudanças isoladas em uma camada |
| **Testabilidade** | Cada camada pode ser testada isoladamente |
| **Reutilização** | Camadas podem ser reutilizadas (ex: API por múltiplos frontends) |
| **Divisão de Trabalho** | Equipes podem trabalhar em camadas diferentes |
| **Evolução Gradual** | Substituir uma camada sem afetar outras |

#### Desvantagens da Arquitetura em Camadas

| Desvantagem | Descrição |
|-------------|-----------|
| **Latência** | Overhead de passar por múltiplas camadas |
| **Acoplamento Vertical** | Mudanças podem propagar verticalmente |
| **Over-engineering** | Pode ser excessivo para sistemas simples |
| **Duplicação** | DTOs duplicados entre camadas |

---

#### Arquitetura em Camadas no DoaCin

**Resposta: SIM, o DoaCin utiliza arquitetura em camadas, especificamente uma variante de 3-4 camadas com separação clara entre Frontend (Apresentação), Backend API (Aplicação), Lógica de Negócio (parcialmente em Controllers/Services) e Dados (Prisma).**

##### Mapeamento das Camadas no DoaCin

```
┌═══════════════════════════════════════════════════════════┐
│  CAMADA 1: APRESENTAÇÃO (Frontend - React SPA)            │
├═══════════════════════════════════════════════════════════┤
│                                                           │
│  src/                                                     │
│  ├── pages/                    ← Páginas (Views)         │
│  │   ├── HomePage.jsx                                    │
│  │   ├── DonationsPage.jsx                               │
│  │   ├── CampaignsPage.jsx                               │
│  │   ├── LoginPage.jsx                                   │
│  │   └── ProfilePage.jsx                                 │
│  │                                                        │
│  ├── components/               ← Componentes UI          │
│  │   ├── StatCard.jsx                                    │
│  │   ├── DonationHistoryItem.jsx                         │
│  │   ├── LocalCard.jsx                                   │
│  │   └── QRCode.jsx                                      │
│  │                                                        │
│  ├── context/                  ← Estado Global (React)   │
│  │   ├── AuthContext.jsx                                 │
│  │   └── DashboardContext.jsx                            │
│  │                                                        │
│  └── services/                 ← Cliente API             │
│      └── api.js (authFetch)                              │
│                                                           │
│  RESPONSABILIDADE:                                        │
│  - Renderização de UI                                    │
│  - Interação com usuário                                 │
│  - Validação de formulários (frontend)                   │
│  - Gerenciamento de estado local (React State)           │
│                                                           │
│  TECNOLOGIAS:                                             │
│  - React 19, React Router, Vite                          │
│  - Leaflet (mapas), CSS                                  │
│                                                           │
│  COMUNICAÇÃO:                                             │
│  - HTTP/JSON para Camada de Aplicação                    │
└═══════════════════════════════════════════════════════════┘
                            ↓
                      HTTP REST API
                            ↓
┌═══════════════════════════════════════════════════════════┐
│  CAMADA 2: APLICAÇÃO (Backend - Express API)              │
├═══════════════════════════════════════════════════════════┤
│                                                           │
│  server.js                     ← Ponto de entrada        │
│  │                                                        │
│  ├── Middlewares Globais:                                │
│  │   ├── cors()                                          │
│  │   └── express.json()                                  │
│  │                                                        │
│  routes/                       ← Definição de Rotas      │
│  ├── auth.js                   POST /api/auth/login      │
│  ├── dashboard.js              GET  /api/dashboard       │
│  ├── donations.js              GET  /api/donations       │
│  ├── campaigns.js              GET  /api/campaigns/...   │
│  └── user.js                   GET  /api/user/profile    │
│  │                                                        │
│  routes/controllers/           ← Controllers (Orquestração)│
│  ├── authController.js         ← login(), register()    │
│  ├── dashboardController.js    ← getDashboardStats()    │
│  ├── donationsController.js    ← getDonationHistory()   │
│  ├── campaignLocals.js         ← getLocalsCampaign()    │
│  └── userController.js         ← getUserProfile()       │
│  │                                                        │
│  routes/controllers/middleware/ ← Middlewares específicos│
│  └── auth.js                   ← JWT verification        │
│                                                           │
│  RESPONSABILIDADE:                                        │
│  - Roteamento HTTP                                       │
│  - Validação de autenticação (JWT)                       │
│  - Orquestração de chamadas                              │
│  - Transformação de dados (DTOs)                         │
│  - Tratamento de erros HTTP                              │
│                                                           │
│  TECNOLOGIAS:                                             │
│  - Express 5, JWT, bcryptjs                              │
│                                                           │
│  COMUNICAÇÃO:                                             │
│  - Recebe HTTP da Camada de Apresentação                 │
│  - Chama Camada de Negócio/Dados                         │
└═══════════════════════════════════════════════════════════┘
                            ↓
                    Function Calls
                            ↓
┌═══════════════════════════════════════════════════════════┐
│  CAMADA 3: NEGÓCIO (Business Logic - parcial)            │
├═══════════════════════════════════════════════════════════┤
│                                                           │
│  services/                     ← Serviços de Negócio     │
│  └── conectaService.js         ← Integração externa      │
│      ├── getAccessToken()                                │
│      ├── post()                                          │
│      └── registrarGamificacao()                          │
│                                                           │
│  routes/controllers/ (parte)   ← Lógica embutida         │
│  │                                                        │
│  │  Exemplos de Lógica de Negócio:                       │
│  │  - Cálculo de cooldown (60 dias M, 90 dias F)        │
│  │  - Pontuação (10 Capibas por doação)                 │
│  │  - Validação de QR Code                               │
│  │  - Regras de agendamento                              │
│                                                           │
│  RESPONSABILIDADE:                                        │
│  - Regras de negócio                                     │
│  - Cálculos complexos                                    │
│  - Validações de domínio                                 │
│  - Integrações externas                                  │
│                                                           │
│  NOTA: No DoaCin, esta camada está PARCIALMENTE          │
│  implementada. Muita lógica de negócio está nos          │
│  controllers (não ideal, mas comum em projetos pequenos) │
│                                                           │
└═══════════════════════════════════════════════════════════┘
                            ↓
                    Prisma Client API
                            ↓
┌═══════════════════════════════════════════════════════════┐
│  CAMADA 4: DADOS (Data Access - Prisma ORM)              │
├═══════════════════════════════════════════════════════════┤
│                                                           │
│  config/                                                  │
│  └── database.js               ← Singleton PrismaClient  │
│                                                           │
│  prisma/                       ← Schema e Migrations     │
│  ├── schema.prisma             ← Modelos de dados        │
│  │   ├── model User                                      │
│  │   ├── model Donation                                  │
│  │   ├── model PontoColeta                               │
│  │   ├── model Agendamento                               │
│  │   └── model Quiz                                      │
│  │                                                        │
│  └── migrations/               ← Histórico de mudanças   │
│      └── 20251103201355_init/                            │
│          └── migration.sql                               │
│                                                           │
│  RESPONSABILIDADE:                                        │
│  - CRUD operations                                       │
│  - Queries SQL (geradas automaticamente)                 │
│  - Transações                                            │
│  - Migrações de schema                                   │
│  - Validações de integridade                             │
│                                                           │
│  TECNOLOGIAS:                                             │
│  - Prisma ORM 6.18.0                                     │
│  - PostgreSQL 16                                         │
│                                                           │
│  COMUNICAÇÃO:                                             │
│  - Recebe chamadas da Camada de Negócio/Aplicação        │
│  - Executa SQL no PostgreSQL                             │
└═══════════════════════════════════════════════════════════┘
                            ↓
                         SQL TCP
                            ↓
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │   Database   │
                    │   (Docker)   │
                    └──────────────┘
```

##### Exemplo Concreto: Fluxo de Doações

**Cenário:** Usuário visualiza histórico de doações

```javascript
// ═══════════════════════════════════════════════════════════
// CAMADA 1: APRESENTAÇÃO (DonationsPage.jsx)
// ═══════════════════════════════════════════════════════════

import { authFetch } from '../../services/api';

function DonationsPage() {
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    // RESPONSABILIDADE DA CAMADA DE APRESENTAÇÃO:
    // - Gerenciar estado da UI
    // - Chamar API
    // - Renderizar dados
    
    authFetch('/api/donations', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        setDonations(data);  // Atualiza estado
      })
      .catch(err => {
        console.error('Erro ao buscar doações:', err);
      });
  }, []);
  
  return (
    <div>
      {donations.map(donation => (
        <DonationHistoryItem key={donation.id} donation={donation} />
      ))}
    </div>
  );
}

// SAÍDA DA CAMADA 1: HTTP GET /api/donations
//                    Header: Authorization: Bearer <token>


// ═══════════════════════════════════════════════════════════
// CAMADA 2: APLICAÇÃO (routes/donations.js)
// ═══════════════════════════════════════════════════════════

import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';
import { getDonationHistory } from './controllers/donationsController.js';

const router = express.Router();

// RESPONSABILIDADE DA CAMADA DE APLICAÇÃO:
// - Definir rota HTTP
// - Aplicar middleware de autenticação
// - Delegar para controller

router.get('/', authMiddleware, getDonationHistory);
//             ↑ Middleware      ↑ Controller
//             verifica JWT      busca dados

export default router;

// SAÍDA DA CAMADA 2: Chama getDonationHistory(req, res)
//                    com req.user = { userId: "abc-123" }


// ═══════════════════════════════════════════════════════════
// CAMADA 2/3: APLICAÇÃO/NEGÓCIO (donationsController.js)
// ═══════════════════════════════════════════════════════════

import prisma from '../../config/database.js';

export const getDonationHistory = async (req, res) => {
  const userId = req.user.userId;  // Extraído do JWT
  
  try {
    // RESPONSABILIDADE DA CAMADA DE APLICAÇÃO:
    // - Orquestrar busca de dados
    // - Transformar dados (DTO)
    // - Retornar resposta HTTP
    
    // CHAMA CAMADA DE DADOS:
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: 'desc' },
      include: {
        pontoColeta: { select: { nome: true } }
      }
    });
    
    // TRANSFORMAÇÃO (DTO):
    // Converte formato do banco para formato da API
    const formattedDonations = donations.map(donation => ({
      id: donation.id,
      donationDate: donation.donationDate,
      status: donation.status,
      pointsEarned: donation.pointsEarned,
      location: {
        name: donation.pontoColeta?.nome || "Local não informado"
      }
    }));
    
    // RESPOSTA HTTP:
    res.status(200).json(formattedDonations);
    
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar histórico',
      error: error.message
    });
  }
};

// SAÍDA DA CAMADA 2/3: Chama prisma.donation.findMany()


// ═══════════════════════════════════════════════════════════
// CAMADA 4: DADOS (config/database.js + Prisma)
// ═══════════════════════════════════════════════════════════

// database.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;

// RESPONSABILIDADE DA CAMADA DE DADOS:
// - Executar query SQL no banco
// - Gerenciar conexões
// - Garantir integridade

// Prisma internamente executa:
// SQL gerado:
/*
  SELECT 
    d.id, d.userId, d.pontoColetaId, d.donationDate, 
    d.status, d.pointsEarned, d.createdAt,
    p.nome as "pontoColeta.nome"
  FROM "Donation" d
  LEFT JOIN "PontoColeta" p ON d.pontoColetaId = p.id
  WHERE d.userId = 'abc-123'
  ORDER BY d.donationDate DESC;
*/

// SAÍDA DA CAMADA 4: Retorna array de objetos com dados do DB
//                    para a Camada 2/3 (controller)


// ═══════════════════════════════════════════════════════════
// RESULTADO FINAL: JSON retornado ao Frontend
// ═══════════════════════════════════════════════════════════

[
  {
    "id": "donation-1",
    "donationDate": "2024-11-15T10:30:00Z",
    "status": "confirmed",
    "pointsEarned": 10,
    "location": {
      "name": "HEMOPE Recife"
    }
  },
  {
    "id": "donation-2",
    "donationDate": "2024-09-10T14:20:00Z",
    "status": "pending",
    "pointsEarned": 0,
    "location": {
      "name": "Hemocentro de Jaboatão"
    }
  }
]
```

##### Análise de Separação de Camadas

**Camada de Apresentação (React):**

```javascript
// ✓ BOM: Responsabilidade clara
// - Apenas UI e estado local
// - Não contém lógica de negócio
// - Não acessa banco diretamente

// src/pages/HomePage.jsx
function HomePage() {
  const { dashboardData } = useDashboard();
  
  // ✓ Apenas renderização
  return (
    <div>
      <StatCard 
        title="Capibas" 
        value={dashboardData.capibasBalance} 
      />
      <DonationCooldown 
        daysRemaining={dashboardData.daysUntilNextDonation} 
      />
    </div>
  );
}

// ✗ EVITAR (violação de camadas):
// const donations = await prisma.donation.findMany(); 
// NÃO acessar banco direto do frontend!
```

**Camada de Aplicação (Express Controllers):**

```javascript
// ✓ BOM: Orquestração e transformação
// routes/controllers/dashboardController.js

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId;
  
  // ✓ Orquestra múltiplas chamadas à camada de dados
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const { _sum } = await prisma.donation.aggregate({
    _sum: { pointsEarned: true },
    where: { userId, status: 'confirmed' }
  });
  const lastDonation = await prisma.donation.findFirst({
    where: { userId, status: 'confirmed' },
    orderBy: { donationDate: 'desc' }
  });
  
  // ✓ Lógica de negócio (deveria estar em service, mas aceitável)
  let daysUntilNextDonation = 0;
  if (lastDonation) {
    const daysSince = calculateDaysBetween(lastDonation.donationDate, new Date());
    const minimumInterval = user.genero === 'M' ? 60 : 90;
    daysUntilNextDonation = Math.max(0, minimumInterval - daysSince);
  }
  
  // ✓ Transforma e retorna DTO
  res.json({
    capibasBalance: _sum.pointsEarned || 0,
    lastDonationDate: lastDonation?.donationDate,
    daysUntilNextDonation,
    genero: user.genero
  });
};

// ✗ EVITAR (violação de camadas):
// res.json(user); // NÃO expor modelo do banco diretamente
// Sempre use DTOs (Data Transfer Objects)
```

**Camada de Dados (Prisma):**

```javascript
// ✓ BOM: Acesso isolado ao banco
// config/database.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],  // Logging de queries
});

export default prisma;

// ✓ Uso correto nos controllers:
// import prisma from '../../config/database.js';
// const users = await prisma.user.findMany();

// ✗ EVITAR (violação de camadas):
// Frontend NÃO deve importar prisma diretamente
// Apenas backend (controllers/services) podem usar
```

##### Benefícios da Arquitetura em Camadas no DoaCin

**1. Testabilidade:**

```javascript
// Teste isolado da Camada de Apresentação
describe('DonationsPage', () => {
  it('deve exibir lista de doações', () => {
    // Mock da camada inferior (API)
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve([
        { id: '1', status: 'confirmed' }
      ])
    });
    
    render(<DonationsPage />);
    // Testa apenas UI
  });
});

// Teste isolado da Camada de Aplicação
describe('getDonationHistory', () => {
  it('deve retornar doações do usuário', async () => {
    // Mock da camada inferior (Prisma)
    prisma.donation.findMany = jest.fn().mockResolvedValue([
      { id: '1', userId: 'user-1' }
    ]);
    
    const req = { user: { userId: 'user-1' } };
    const res = { json: jest.fn(), status: jest.fn() };
    
    await getDonationHistory(req, res);
    
    expect(res.json).toHaveBeenCalled();
    // Testa apenas controller
  });
});
```

**2. Substituibilidade:**

```javascript
// Possível substituir Prisma por outro ORM sem afetar camadas superiores

// Antes (Prisma):
const donations = await prisma.donation.findMany({ where: { userId } });

// Depois (Sequelize):
const donations = await Donation.findAll({ where: { userId } });

// Controllers permanecem iguais (apenas muda a camada de dados)
```

**3. Reutilização:**

```javascript
// API (Camada de Aplicação) pode ser usada por múltiplos frontends:

// Frontend Web (React):
fetch('/api/donations').then(res => res.json());

// Mobile App (React Native):
fetch('https://doacin.com/api/donations').then(res => res.json());

// CLI Tool:
const axios = require('axios');
axios.get('/api/donations');

// Mesma API serve todos os clientes
```

##### Onde o DoaCin Poderia Melhorar

**Problema 1: Lógica de Negócio nos Controllers**

```javascript
// ✗ ATUAL (não ideal):
// routes/controllers/dashboardController.js
export const getDashboardStats = async (req, res) => {
  // ... busca dados ...
  
  // Lógica de negócio embutida no controller
  const minimumInterval = user.genero === 'M' ? 60 : 90;
  daysUntilNextDonation = Math.max(0, minimumInterval - daysSince);
  
  res.json({ daysUntilNextDonation });
};

// ✓ MELHOR (separar em service):
// services/donationService.js
export class DonationService {
  calculateCooldown(user, lastDonationDate) {
    const daysSince = this.calculateDaysBetween(lastDonationDate, new Date());
    const minimumInterval = user.genero === 'M' ? 60 : 90;
    return Math.max(0, minimumInterval - daysSince);
  }
  
  calculateDaysBetween(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  }
}

// routes/controllers/dashboardController.js
import { DonationService } from '../../services/donationService.js';

export const getDashboardStats = async (req, res) => {
  const user = await prisma.user.findUnique(...);
  const lastDonation = await prisma.donation.findFirst(...);
  
  // Delega lógica de negócio para o service
  const donationService = new DonationService();
  const daysUntilNextDonation = donationService.calculateCooldown(
    user, 
    lastDonation?.donationDate
  );
  
  res.json({ daysUntilNextDonation });
};

// BENEFÍCIO: Lógica de negócio pode ser testada isoladamente
```

**Problema 2: Ausência de DTOs explícitos**

```javascript
// ✗ ATUAL (retorna modelo do banco):
const donations = await prisma.donation.findMany({ include: { pontoColeta: true } });
res.json(donations);  // Expõe estrutura interna

// ✓ MELHOR (usar DTOs):
// dtos/DonationDTO.js
export class DonationDTO {
  static fromEntity(donation) {
    return {
      id: donation.id,
      date: donation.donationDate,
      location: donation.pontoColeta?.nome,
      status: donation.status,
      points: donation.pointsEarned
    };
  }
  
  static fromEntities(donations) {
    return donations.map(d => DonationDTO.fromEntity(d));
  }
}

// Controller:
const donations = await prisma.donation.findMany(...);
const dto = DonationDTO.fromEntities(donations);
res.json(dto);

// BENEFÍCIO: Isola mudanças no schema do banco
```

---

## Resumo do Capítulo 7 (Parte 1)

### 7.1 Arquitetura Monolítica ✅
- **Definição completa** com 5 características fundamentais
- **Estrutura típica** ilustrada
- **Tipos**: Puro, Modular, Distribuído
- **Vantagens e Desvantagens** (tabelas completas)
- **Análise do DoaCin**: SIM, é um monólito modular
- **6 Evidências concretas** com código
- **Comparação**: DoaCin vs Microservices
- **Quando migrar** (sinais de que é hora)
- **Conclusão**: Decisão correta para o contexto

### 7.2 Arquitetura em Camadas ✅
- **Definição completa** com 3 princípios fundamentais
- **Estrutura clássica** (4 camadas) explicada
- **Variações**: Abertas, Fechadas, Crosscutting
- **Vantagens e Desvantagens** documentadas
- **Análise do DoaCin**: SIM, usa arquitetura em camadas
- **Mapeamento completo** das 4 camadas no DoaCin:
  1. Apresentação (React)
  2. Aplicação (Express)
  3. Negócio (Services, parcial)
  4. Dados (Prisma)
- **Exemplo concreto**: Fluxo completo de doações (com código)
- **Análise de separação** (boas práticas e violações)
- **Benefícios** no DoaCin (testabilidade, substituibilidade)
- **Melhorias propostas** (services dedicados, DTOs)

**Total de diagramas**: 5
**Exemplos de código**: 15+
**Análise detalhada**: DoaCin como Monólito Modular em Camadas

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - Capítulo 7: Arquitetura (Parte 1)*
