# Respostas - Capítulos 4 e 6: Engenharia de Software aplicada ao DoaCin

## Capítulo 4: Modelos

### 4.1 Engenharia Avante vs Engenharia Reversa

#### Definições

**Engenharia Avante (Forward Engineering)**

Processo tradicional de desenvolvimento de software que parte de requisitos e especificações de alto nível para produzir código executável e artefatos de implementação.

**Fluxo:**
```
Requisitos → Design → Implementação → Código → Sistema Executável
```

**Características:**
- Abordagem top-down (do abstrato para o concreto)
- Parte de documentação e modelos UML
- Gera código a partir dos modelos
- Processo criativo e construtivo

**Engenharia Reversa (Reverse Engineering)**

Processo de análise de um sistema existente para identificar seus componentes, relacionamentos e criar representações em níveis mais altos de abstração.

**Fluxo:**
```
Sistema Executável → Código → Análise → Modelos → Documentação
```

**Características:**
- Abordagem bottom-up (do concreto para o abstrato)
- Parte do código existente
- Gera modelos e documentação a partir do código
- Processo analítico e de compreensão

#### Comparação Detalhada

| Aspecto | Engenharia Avante | Engenharia Reversa |
|---------|-------------------|-------------------|
| **Direção** | Requisitos → Código | Código → Modelos |
| **Objetivo** | Criar novo sistema | Entender sistema existente |
| **Entrada** | Especificações, UML | Código-fonte, binários |
| **Saída** | Código executável | Diagramas, documentação |
| **Quando usar** | Novo projeto | Sistema legado |
| **Atividade** | Construção | Análise |
| **Abstraçãoo** | Alto → Baixo nível | Baixo → Alto nível |
| **Ferramentas** | IDEs, geradores de código | Decompiladores, profilers |
| **Documentação** | Criada antes do código | Criada após o código |
| **Complexidade** | Planejamento estruturado | Descoberta e dedução |

#### Engenharia Avante no DoaCin

**Exemplos práticos de quando foi aplicada:**

**1. Design do Schema do Banco de Dados**

O arquivo [prisma/schema.prisma](prisma/schema.prisma) foi criado antes da implementação, definindo os modelos de dados:

```prisma
// ENGENHARIA AVANTE: Modelo conceitual → Schema Prisma → Tabelas no DB

// 1. Requisito: "Sistema precisa gerenciar usuários"
// 2. Design: Modelo User com atributos necessários
// 3. Implementação: Schema Prisma

model User {
  id                String    @id @default(uuid())
  cpf               String    @unique
  nome              String
  email             String    @unique
  password          String
  phone             String?
  birthDate         DateTime?
  bloodType         String?
  weight            Float?
  endereco          String?
  genero            String?
  foto              String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  donations         Donation[]
  agendamentos      Agendamento[]
  quizAttempts      UserQuizAttempt[]
}

// 4. Geração: npx prisma migrate dev
// 5. Resultado: Tabelas SQL criadas automaticamente
```

**Processo Forward:**
```
Requisitos de Negócio
    ↓
Modelo Conceitual (ER Diagram mental)
    ↓
Schema Prisma (DSL de alto nível)
    ↓
[prisma generate] - Ferramenta
    ↓
Cliente Prisma TypeScript
    ↓
[prisma migrate] - Ferramenta
    ↓
Tabelas PostgreSQL
```

**2. Arquitetura da API REST**

Planejamento estruturado antes da implementação:

```
1. DESIGN (Engenharia Avante):
   └─ Definir endpoints necessários
      ├─ POST /api/auth/register
      ├─ POST /api/auth/login
      ├─ GET  /api/dashboard
      ├─ GET  /api/donations
      ├─ POST /api/donations
      └─ GET  /api/campaigns/locals

2. ESPECIFICAÇÃO:
   └─ Documentar contratos (request/response)
   
3. IMPLEMENTAÇÃO:
   └─ Criar rotas e controllers

4. TESTE:
   └─ Validar endpoints
```

**3. Componentização do Frontend**

Design da estrutura de componentes React antes de codificar:

```
Design Hierárquico (Wireframes/Mockups):

App.jsx
├─ AuthProvider
├─ DashboardProvider
└─ BrowserRouter
   ├─ LoginPage (rota pública)
   └─ PrivateRoute
      └─ MainLayout
         ├─ Sidebar (navegação)
         └─ Outlet
            ├─ HomePage
            │  ├─ StatCard
            │  ├─ DonationCooldown
            │  └─ RecentActivity
            ├─ DonationsPage
            │  └─ DonationHistoryItem
            └─ CampaignsPage
               └─ LocalCard

Implementação seguiu este design (Forward)
```

#### Engenharia Reversa no DoaCin

**Exemplos práticos de quando seria aplicada:**

**1. Documentar Sistema Legado (Cenário Hipotético)**

Se o DoaCin fosse um sistema legado sem documentação:

```
PROCESSO REVERSO:

1. ANÁLISE DO CÓDIGO:
   ├─ Ler server.js → identificar rotas montadas
   ├─ Seguir imports → mapear estrutura de arquivos
   └─ Analisar controllers → entender lógica de negócio

2. EXTRAÇÃO DE MODELOS:
   └─ Ler schema.prisma → gerar Diagrama ER
      ├─ Identificar entidades (User, Donation, PontoColeta)
      ├─ Mapear relacionamentos (1:N, N:M)
      └─ Criar diagrama visual

3. DOCUMENTAÇÃO DE FLUXOS:
   └─ Rastrear chamadas de API
      ├─ Frontend: authFetch('/api/donations')
      ├─ Routes: router.get('/', authMiddleware, getDonationHistory)
      ├─ Controller: prisma.donation.findMany()
      └─ Database: SELECT * FROM donations

4. GERAÇÃO DE DIAGRAMAS:
   └─ Criar diagramas UML:
      ├─ Diagrama de Classes
      ├─ Diagrama de Sequência
      └─ Diagrama de Componentes
```

**Ferramentas que poderiam ser usadas:**

| Ferramenta | Função | Uso no DoaCin |
|------------|--------|---------------|
| **Prisma Studio** | Visualizar schema do DB | `npx prisma studio` |
| **VSCode + Extensions** | Mapeamento de código | "Find All References" |
| **PlantUML** | Gerar diagramas de código | Parser de imports |
| **Madge** | Visualizar dependências | `npx madge --image graph.svg src/` |
| **TypeDoc** | Gerar docs de TypeScript | Extrair JSDoc comments |

**2. Análise de Dependências do Projeto**

Extrair insights a partir do código existente:

```bash
# Engenharia Reversa: Analisar package.json para entender arquitetura

# Análise:
{
  "dependencies": {
    "@prisma/client": "^6.18.0",    # → ORM, PostgreSQL
    "express": "^5.1.0",            # → Backend REST API
    "react": "^19.1.1",             # → Frontend SPA
    "jsonwebtoken": "^9.0.2",       # → Autenticação JWT
    "bcryptjs": "^3.0.2",           # → Hash de senhas
    "leaflet": "^1.9.4",            # → Mapas interativos
    "react-router-dom": "^7.9.5"    # → SPA routing
  }
}

# Conclusão Reversa:
ARQUITETURA IDENTIFICADA:
- Monolito fullstack (Node.js + React)
- SPA com routing client-side
- API REST stateless
- Auth baseado em JWT
- Banco relacional (Prisma ORM)
- Mapas com Leaflet
```

**3. Reconstruir Diagrama de Caso de Uso**

A partir do código, deduzir os casos de uso:

```javascript
// Análise do arquivo: routes/donations.js

router.get('/', authMiddleware, getDonationHistory);
// → Use Case: "Visualizar Histórico de Doações"

router.post('/', authMiddleware, createDonation);
// → Use Case: "Registrar Nova Doação"

router.post('/confirm', authMiddleware, confirmDonation);
// → Use Case: "Confirmar Doação via QR Code"

// Análise do arquivo: routes/auth.js

router.post('/register', register);
// → Use Case: "Criar Conta no Sistema"

router.post('/login', login);
// → Use Case: "Fazer Login"
```

**Diagrama de Caso de Uso Reverso:**

```
       Doador
         |
         |--- (Criar Conta)
         |--- (Fazer Login)
         |--- (Visualizar Histórico)
         |--- (Registrar Doação)
         |--- (Ver Dashboard)
         |--- (Explorar Campanhas)
         |--- (Confirmar Doação QR)
```

#### Reengenharia (Combinação de Ambas)

**Conceito:** Combinar engenharia reversa + avante para modernizar sistemas legados.

**Processo:**
```
Sistema Legado
    ↓
[Engenharia Reversa]
    ↓
Modelos e Documentação
    ↓
Análise e Refatoração
    ↓
Novos Requisitos/Design
    ↓
[Engenharia Avante]
    ↓
Sistema Modernizado
```

**Exemplo no DoaCin:**

Se o sistema fosse originalmente em PHP e precisasse migração para Node.js:

```
1. REVERSA:
   - Analisar código PHP legado
   - Documentar lógica de negócio
   - Mapear estrutura do banco MySQL

2. ANÁLISE:
   - Identificar acoplamentos
   - Detectar code smells
   - Planejar melhorias

3. AVANTE:
   - Redesenhar com Node.js + Express
   - Migrar para PostgreSQL + Prisma
   - Implementar nova arquitetura REST
   - Adicionar frontend React
```

#### Quando Usar Cada Abordagem

**Use Engenharia Avante quando:**
- Iniciar um projeto do zero ✓ (DoaCin começou assim)
- Requisitos são bem compreendidos
- Time tem liberdade para design
- Documentação precisa ser criada

**Use Engenharia Reversa quando:**
- Sistema legado sem documentação
- Manutenção de código de terceiros
- Integração com APIs desconhecidas
- Migração/atualização de tecnologia
- Auditoria de segurança
- Análise forense de código

**No contexto do DoaCin:**

| Cenário | Abordagem | Exemplo |
|---------|-----------|---------|
| Criar nova feature | Avante | Adicionar sistema de notificações |
| Entender código de colega | Reversa | Debuggar bug no mapa |
| Documentar após codar | Reversa | Gerar diagramas UML do código atual |
| Refatorar módulo | Ambas | Melhorar arquitetura de autenticação |
| Integrar API externa | Reversa | Estudar API do Conecta Recife |

---

## Capítulo 6: Padrões de Projeto

### 6.1 Padrão Singleton

#### Definição

**Singleton** é um padrão de projeto criacional que garante que uma classe tenha apenas uma única instância e fornece um ponto de acesso global a essa instância.

#### Problema que Resolve

**Situação problemática:**
```javascript
// SEM Singleton - Problema:
import { PrismaClient } from '@prisma/client';

// Arquivo 1: userController.js
const prisma = new PrismaClient(); // Instância 1
export const getUsers = () => prisma.user.findMany();

// Arquivo 2: donationController.js
const prisma = new PrismaClient(); // Instância 2
export const getDonations = () => prisma.donation.findMany();

// Arquivo 3: dashboardController.js
const prisma = new PrismaClient(); // Instância 3
export const getStats = () => prisma.user.count();

// PROBLEMA: 3 conexões simultâneas com o banco!
// - Desperdício de recursos
// - Limite de conexões pode ser atingido
// - Inconsistências de estado
```

#### Estrutura do Singleton

**Elementos:**
1. **Construtor Privado**: Impede criação direta de instâncias
2. **Instância Estática**: Armazena a única instância
3. **Método de Acesso**: Retorna a instância única (lazy initialization)

#### Implementação Clássica (JavaScript)

```javascript
class DatabaseConnection {
  // 1. Propriedade estática para armazenar a instância única
  static instance = null;
  
  // 2. Construtor que implementa lógica Singleton
  constructor() {
    // Se já existe uma instância, retorna ela
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    // Senão, cria a instância e armazena
    this.connection = this.connect();
    DatabaseConnection.instance = this;
  }
  
  connect() {
    console.log('Conectando ao banco de dados...');
    return { status: 'connected' };
  }
  
  // 3. Método estático para obter a instância
  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

// Uso:
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
const db3 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true (mesma instância)
console.log(db2 === db3); // true (mesma instância)
```

#### Singleton no DoaCin: PrismaClient

**Localização:** [config/database.js](config/database.js)

```javascript
import { PrismaClient } from '@prisma/client';

// Singleton do PrismaClient para evitar múltiplas instâncias e esgotamento de conexões
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Armazena a instância no global para reutilização em desenvolvimento
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Análise detalhada:**

```javascript
// 1. Factory Function (em vez de classe)
const prismaClientSingleton = () => {
  return new PrismaClient();
};
// Encapsula a criação da instância

// 2. Verificação de Instância Existente
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
//             ↑ Se já existe        ↑ Se não existe, cria

// 3. Armazenamento Global (Development)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
// Em dev (hot reload), preserva a instância entre reloads
// Em prod, não é necessário (processo não reinicia)

// 4. Export Default - Ponto de Acesso Global
export default prisma;
// Todos os módulos importam a MESMA instância
```

**Por que é necessário no DoaCin?**

| Problema | Sem Singleton | Com Singleton |
|----------|---------------|---------------|
| **Conexões** | 10+ instâncias Prisma | 1 instância compartilhada |
| **Limite do DB** | Pode atingir max_connections | Gerenciado por pool único |
| **Memória** | ~50MB por instância | ~50MB total |
| **Performance** | Overhead de múltiplas conexões | Otimizado |
| **Hot Reload (Dev)** | Nova instância a cada mudança | Instância preservada |

**Uso em múltiplos controllers:**

```javascript
// routes/controllers/authController.js
import prisma from '../../config/database.js'; // Instância única

export const register = async (req, res) => {
  const user = await prisma.user.create({ data: {...} });
};

// routes/controllers/donationsController.js
import prisma from '../../config/database.js'; // Mesma instância

export const getDonationHistory = async (req, res) => {
  const donations = await prisma.donation.findMany({...});
};

// routes/controllers/dashboardController.js
import prisma from '../../config/database.js'; // Mesma instância

export const getDashboardStats = async (req, res) => {
  const stats = await prisma.donation.aggregate({...});
};

// Todas as importações apontam para a MESMA instância Prisma
```

#### Singleton no DoaCin: ConectaService

**Localização:** [services/conectaService.js](services/conectaService.js)

```javascript
// A classe ConectaService atua como um Singleton para manter o estado do Token
class ConectaService {
    constructor() {
        // Inicializa o cliente Axios com a URL base da API 
        this.client = axios.create({
            baseURL: process.env.CONECTA_API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
        });

        this.accessToken = null; // Estado compartilhado
        this.isRefreshing = false; // Flag global
        this.failedQueue = []; // Fila compartilhada
        
        // Interceptors configurados uma única vez
        this.setupInterceptors();
    }
    
    async getAccessToken() {
        // Lógica de autenticação
    }
    
    async post(endpoint, data) {
        return this.client.post(endpoint, data);
    }
}

// SINGLETON: Apenas uma instância é criada e exportada
const conectaServiceInstance = new ConectaService();
export default conectaServiceInstance;
```

**Por que Singleton aqui é crucial:**

```javascript
// Cenário SEM Singleton (problemático):

// Controller 1
const service1 = new ConectaService();
await service1.post('/check-in', data); // Token obtido

// Controller 2 (simultâneo)
const service2 = new ConectaService();
await service2.post('/check-in', data); // Token obtido NOVAMENTE

// PROBLEMA: Múltiplas autenticações desnecessárias


// Cenário COM Singleton (correto):

// Controller 1
import conectaService from '../services/conectaService.js';
await conectaService.post('/check-in', data); // Token obtido e cached

// Controller 2 (simultâneo)
import conectaService from '../services/conectaService.js'; // MESMA instância
await conectaService.post('/check-in', data); // Reusa token existente

// BENEFÍCIO: Token compartilhado, renovação automática sincronizada
```

**Estado compartilhado crítico:**

| Propriedade | Função | Por que deve ser única |
|-------------|--------|------------------------|
| `accessToken` | Armazena JWT da API externa | Evita re-autenticação |
| `isRefreshing` | Flag de renovação em andamento | Sincroniza requisições |
| `failedQueue` | Fila de requisições pendentes | Coordena retry após refresh |

**Diagrama de funcionamento:**

```
Requisição 1 → ConectaService (instância única)
                      ↓
                [accessToken null?]
                      ↓ Sim
                [Obtém token] ← Bloqueia com isRefreshing
                      ↓
Requisição 2 →  [accessToken existe?]
                      ↓ Sim
                [Reusa token] ← Não precisa autenticar novamente
                      ↓
Requisição 3 →  [Token expirou?]
                      ↓ Sim
                [Renova token] ← Adiciona Req3 à failedQueue
                      ↓
                [Processa fila] ← Todas as requisições usam novo token
```

#### Vantagens e Desvantagens do Singleton

**Vantagens:**

| Vantagem | Exemplo no DoaCin |
|----------|-------------------|
| **Economia de Recursos** | 1 conexão DB em vez de 10+ |
| **Estado Global Consistente** | Token OAuth compartilhado |
| **Controle de Acesso** | Ponto único de configuração |
| **Lazy Initialization** | Conexão só criada quando necessária |
| **Coordenação** | Sincronização de refresh de token |

**Desvantagens:**

| Desvantagem | Mitigação no DoaCin |
|-------------|---------------------|
| **Acoplamento Global** | Import explícito, não variável global |
| **Dificulta Testes** | Possível mockar com Jest |
| **Viola Single Responsibility** | Classe tem lógica + gerenciamento de instância |
| **Problemas de Concorrência** | Node.js é single-threaded (menos crítico) |
| **Anti-pattern em alguns casos** | Aqui é justificado (conexão DB) |

#### Alternativas ao Singleton

**1. Dependency Injection:**

```javascript
// Sem Singleton - Injeção de Dependência
class DonationController {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }
  
  async getDonations() {
    return this.prisma.donation.findMany();
  }
}

// Uso:
const prisma = new PrismaClient();
const controller = new DonationController(prisma);
```

**2. Module Scope (Abordagem do DoaCin):**

```javascript
// database.js - Singleton via module
const prisma = new PrismaClient();
export default prisma;

// Outros arquivos importam
import prisma from './database.js';
// Sempre a mesma instância devido ao cache de módulos do Node.js
```

---

### 6.2 Outros Padrões de Projeto no DoaCin

#### 6.2.1 Padrão Factory (Factory Method / Abstract Factory)

**Definição:** Define uma interface para criar objetos, mas deixa as subclasses decidirem qual classe instanciar.

**No DoaCin:** Criação dinâmica de PontoColeta

**Localização:** [routes/controllers/donationsController.js](routes/controllers/donationsController.js)

```javascript
export const createDonation = async (req, res) => {
  const { donationDate, hemocentro } = req.body;
  
  // Procurar o ponto de coleta pelo nome
  let pontoColeta = await prisma.pontoColeta.findFirst({
    where: {
      nome: { contains: hemocentro, mode: "insensitive" }
    }
  });
  
  // FACTORY PATTERN: Se não encontrar, cria um novo
  if (!pontoColeta) {
    pontoColeta = await prisma.pontoColeta.create({
      data: {
        nome: hemocentro,
        endereco: "Endereço não informado",
        tipo: "fixed"
      }
    });
  }
  
  // Usa o pontoColeta (criado ou existente)
  const donation = await prisma.donation.create({
    data: {
      userId: userId,
      pontoColetaId: pontoColeta.id,
      donationDate: new Date(donationDate),
      status: "pending"
    }
  });
};
```

**Análise:**

```javascript
// FACTORY PATTERN Aplicado:

// Cliente (controller) não precisa saber:
// - Como criar PontoColeta
// - Detalhes de validação
// - Lógica de decisão (criar vs buscar)

// Factory decide:
if (exists) {
  return existingPontoColeta; // Flyweight pattern também
} else {
  return createNewPontoColeta(); // Factory creation
}
```

**Benefícios:**
- Encapsula lógica de criação
- Reduz duplicação de código
- Facilita manutenção

---

#### 6.2.2 Padrão Strategy

**Definição:** Define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis.

**No DoaCin:** Cálculo de cooldown baseado em gênero

**Localização:** [routes/controllers/dashboardController.js](routes/controllers/dashboardController.js)

```javascript
export const getDashboardStats = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { genero: true, birthDate: true, weight: true }
  });
  
  const lastDonation = await prisma.donation.findFirst({
    where: { userId: userId, status: 'confirmed' },
    orderBy: { donationDate: 'desc' }
  });
  
  let daysUntilNextDonation = 0;
  
  if (lastDonation) {
    const lastDate = new Date(lastDonation.donationDate);
    const today = new Date();
    const daysSinceLastDonation = Math.floor(
      (today - lastDate) / (1000 * 60 * 60 * 24)
    );
    
    // STRATEGY PATTERN: Diferentes estratégias baseadas em gênero
    let minimumIntervalDays;
    
    if (user.genero === 'M' || user.genero === 'masculino') {
      minimumIntervalDays = 60; // Estratégia Masculina
    } else if (user.genero === 'F' || user.genero === 'feminino') {
      minimumIntervalDays = 90; // Estratégia Feminina
    } else {
      minimumIntervalDays = 90; // Estratégia Padrão (conservadora)
    }
    
    daysUntilNextDonation = Math.max(
      0,
      minimumIntervalDays - daysSinceLastDonation
    );
  }
  
  res.json({
    daysUntilNextDonation,
    canDonateNow: daysUntilNextDonation === 0
  });
};
```

**Refatoração para Strategy Pattern explícito:**

```javascript
// cooldownStrategies.js

class CooldownStrategy {
  calculateDays(lastDonationDate) {
    throw new Error('Método deve ser implementado');
  }
}

class MasculineCooldownStrategy extends CooldownStrategy {
  calculateDays(lastDonationDate) {
    const daysSince = this.daysBetween(lastDonationDate, new Date());
    return Math.max(0, 60 - daysSince);
  }
  
  daysBetween(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  }
}

class FeminineCooldownStrategy extends CooldownStrategy {
  calculateDays(lastDonationDate) {
    const daysSince = this.daysBetween(lastDonationDate, new Date());
    return Math.max(0, 90 - daysSince);
  }
  
  daysBetween(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  }
}

class DefaultCooldownStrategy extends CooldownStrategy {
  calculateDays(lastDonationDate) {
    const daysSince = this.daysBetween(lastDonationDate, new Date());
    return Math.max(0, 90 - daysSince);
  }
  
  daysBetween(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  }
}

// Factory para selecionar estratégia
export class CooldownStrategyFactory {
  static getStrategy(genero) {
    if (genero === 'M' || genero === 'masculino') {
      return new MasculineCooldownStrategy();
    } else if (genero === 'F' || genero === 'feminino') {
      return new FeminineCooldownStrategy();
    } else {
      return new DefaultCooldownStrategy();
    }
  }
}

// Uso no controller:
const strategy = CooldownStrategyFactory.getStrategy(user.genero);
const daysUntilNextDonation = strategy.calculateDays(lastDonation.donationDate);
```

**Benefícios do Strategy Pattern:**
- Código mais testável (cada estratégia isolada)
- Fácil adicionar novos critérios (idade, tipo sanguíneo)
- Segue Open/Closed Principle (aberto para extensão)

---

#### 6.2.3 Padrão Observer

**Definição:** Define dependência um-para-muitos entre objetos, de modo que quando um objeto muda de estado, todos os seus dependentes são notificados.

**No DoaCin:** Context API do React (AuthContext, DashboardContext)

**Localização:** [src/context/AuthContext.jsx](src/context/AuthContext.jsx)

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';

// SUBJECT: AuthContext
const AuthContext = createContext();

// PROVIDER: Gerencia estado e notifica observers
export function AuthProvider({ children }) {
  // Estado observável
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Efeito colateral (Observer interno)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Métodos que alteram estado (Subject notifica Observers)
  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    // Mudança de estado → Notifica todos os observers
    setToken(data.token);
    setIsAuthenticated(true);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    // Mudança de estado → Notifica todos os observers
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Provider disponibiliza estado para observers
  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para componentes se inscreverem como observers
export function useAuth() {
  return useContext(AuthContext);
}
```

**Componentes Observers:**

```jsx
// OBSERVER 1: PrivateRoute.jsx
import { useAuth } from '../context/AuthContext';

function PrivateRoute() {
  const { isAuthenticated } = useAuth(); // Se inscreve
  
  // Re-renderiza automaticamente quando isAuthenticated muda
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

// OBSERVER 2: MainLayout.jsx
import { useAuth } from '../context/AuthContext';

function MainLayout() {
  const { logout } = useAuth(); // Se inscreve
  
  return (
    <button onClick={logout}>Sair</button>
    // Quando logout() é chamado, TODOS os observers são notificados
  );
}

// OBSERVER 3: HomePage.jsx
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { token } = useAuth(); // Se inscreve
  
  // Re-renderiza quando token muda
  return <div>Token: {token ? 'Válido' : 'Inválido'}</div>;
}
```

**Diagrama Observer:**

```
                  AuthContext (Subject)
                        |
                        | estado: { token, isAuthenticated }
                        |
        +---------------+---------------+
        |               |               |
   PrivateRoute    MainLayout       HomePage
   (Observer 1)   (Observer 2)    (Observer 3)
        |               |               |
   Re-renderiza   Re-renderiza    Re-renderiza
   quando auth    quando logout   quando token
   muda           é chamado       muda
```

**Benefícios:**
- Desacoplamento (observers não conhecem uns aos outros)
- Sincronização automática de UI
- Reatividade (React cuida das notificações)

---

#### 6.2.4 Padrão Middleware (Chain of Responsibility)

**Definição:** Permite passar requisições por uma cadeia de handlers. Cada handler decide se processa ou passa adiante.

**No DoaCin:** Sistema de autenticação com middleware

**Localização:** [routes/controllers/middleware/auth.js](routes/controllers/middleware/auth.js)

```javascript
// MIDDLEWARE: Handler de autenticação
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    // 1. Extrai token do header
    const token = req.headers.authorization.split(' ')[1];
    
    // 2. Verifica validade
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Anexa dados ao request
    req.user = { userId: decodedToken.userId };
    
    // 4. Passa para próximo handler na cadeia
    next();
  } catch (error) {
    // 5. Interrompe cadeia se falhar
    res.status(401).json({ message: 'Autenticação falhou.' });
  }
};
```

**Cadeia de Middlewares:**

```javascript
// routes/donations.js

import authMiddleware from './controllers/middleware/auth.js';
import { getDonationHistory } from './controllers/donationsController.js';

// CADEIA: authMiddleware → getDonationHistory
router.get('/', authMiddleware, getDonationHistory);
//             ↑ Handler 1   ↑ Handler 2

// Fluxo de execução:
// Requisição → authMiddleware → next() → getDonationHistory → Resposta
//                     ↓ Se falhar
//                  401 Error (não chama next)
```

**Múltiplos Middlewares:**

```javascript
// Exemplo de cadeia maior (não implementado no DoaCin atual)

const logMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

const validateDonationMiddleware = (req, res, next) => {
  if (!req.body.donationDate) {
    return res.status(400).json({ error: 'Data obrigatória' });
  }
  next();
};

const checkCooldownMiddleware = async (req, res, next) => {
  // Verifica se pode doar
  const canDonate = await checkUserCooldown(req.user.userId);
  if (!canDonate) {
    return res.status(403).json({ error: 'Ainda em período de cooldown' });
  }
  next();
};

// CADEIA COMPLETA:
router.post('/donations',
  logMiddleware,              // Handler 1: Log
  authMiddleware,             // Handler 2: Auth
  validateDonationMiddleware, // Handler 3: Validação
  checkCooldownMiddleware,    // Handler 4: Regra de negócio
  createDonation              // Handler 5: Controller final
);

// Fluxo:
// Request → Log → Auth → Validate → Cooldown → Create → Response
//           ↓      ↓       ↓          ↓          ↓
//         next() next()  next()     next()     res.json()
```

**No Express (server.js):**

```javascript
// server.js - Middlewares globais

app.use(cors());        // Handler 1: CORS
app.use(express.json()); // Handler 2: Body Parser

// Rotas (cada rota pode ter sua própria cadeia)
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Todas as requisições passam pela cadeia:
// Request → CORS → JSON Parser → Router → Middleware de Rota → Controller
```

**Benefícios:**
- Separação de responsabilidades
- Reutilização de lógica (auth em múltiplas rotas)
- Composição flexível
- Fácil adicionar/remover handlers

---

#### 6.2.5 Padrão Proxy

**Definição:** Fornece um substituto ou placeholder para outro objeto para controlar acesso a ele.

**No DoaCin:** authFetch como proxy para fetch nativo

**Localização:** [services/api.js](services/api.js)

```javascript
// PROXY: Intercepta e adiciona funcionalidade ao fetch nativo

export const authFetch = async (url, options = {}) => {
  // 1. Pré-processamento: Busca token
  const token = localStorage.getItem('token');

  // 2. Pré-processamento: Monta headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Delega para o objeto real (fetch)
  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  // 4. Pós-processamento: Verifica autenticação
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Não autorizado');
  }

  // 5. Retorna resposta
  return response;
};

// USO:
// Em vez de: fetch('/api/donations')
// Usa-se:    authFetch('/api/donations')
// O proxy adiciona auth automaticamente
```

**Comparação:**

```javascript
// SEM PROXY - Código duplicado:

// HomePage.jsx
const token = localStorage.getItem('token');
const response = await fetch('/api/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// DonationsPage.jsx
const token = localStorage.getItem('token');
const response = await fetch('/api/donations', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// CampaignsPage.jsx
const token = localStorage.getItem('token');
const response = await fetch('/api/campaigns', {
  headers: { 'Authorization': `Bearer ${token}` }
});


// COM PROXY - DRY (Don't Repeat Yourself):

// HomePage.jsx
const response = await authFetch('/api/dashboard');

// DonationsPage.jsx
const response = await authFetch('/api/donations');

// CampaignsPage.jsx
const response = await authFetch('/api/campaigns');
```

**Tipos de Proxy:**

| Tipo | Função | Exemplo no DoaCin |
|------|--------|-------------------|
| **Virtual Proxy** | Lazy loading de objetos pesados | Não implementado |
| **Protection Proxy** | Controla acesso | authFetch (verifica token) |
| **Remote Proxy** | Representa objeto remoto | authFetch (API REST) |
| **Logging Proxy** | Adiciona logging | Poderia adicionar console.log |
| **Caching Proxy** | Cache de resultados | Não implementado |

**Axios Interceptors (ConectaService):**

Outro exemplo de Proxy no DoaCin:

```javascript
// services/conectaService.js

this.client.interceptors.request.use(
  (config) => {
    // PROXY: Adiciona token automaticamente
    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return config;
  }
);

this.client.interceptors.response.use(
  (response) => response,
  (error) => {
    // PROXY: Intercepta 401 e renova token
    return this.handleResponseError(error);
  }
);
```

---

#### 6.2.6 Padrão Adapter

**Definição:** Converte interface de uma classe em outra interface esperada pelos clientes.

**No DoaCin:** Normalização de dados da API externa

**Localização:** [routes/controllers/campaignLocals.js](routes/controllers/campaignLocals.js)

```javascript
export const getLocalsCampaign = async (req, res) => {
  // 1. Busca dados do banco (formato interno)
  const locals = await prisma.pontoColeta.findMany({
    select: {
      id: true,
      nome: true,
      endereco: true,
      horarioAbertura: true,
      horarioFechamento: true,
      telefone: true,
      tipo: true,
      latitude: true,
      longitude: true,
      eventStartDate: true,
      eventEndDate: true
    }
  });

  // 2. ADAPTER: Transforma para formato esperado pelo frontend
  const normalized = locals.map((l) => ({
    id: l.id,
    name: l.nome,                    // nome → name
    address: l.endereco,             // endereco → address
    hours:                           // horários separados → string única
      l.horarioAbertura && l.horarioFechamento
        ? `${l.horarioAbertura} - ${l.horarioFechamento}`
        : l.horarioAbertura || l.horarioFechamento || "",
    contact: l.telefone || null,     // telefone → contact
    type: l.tipo || "fixed",
    latitude: l.latitude,
    longitude: l.longitude,
    eventStartDate: l.eventStartDate,
    eventEndDate: l.eventEndDate
  }));

  // 3. Retorna no formato adaptado
  return res.status(200).json({ data: normalized });
};
```

**Outro exemplo - Adapter no Frontend:**

```javascript
// src/pages/CampaignsPage.jsx

authFetch("/api/campaigns/locals")
  .then((res) => res.json())
  .then((json) => {
    // ADAPTER: Transforma dados da API para formato interno do componente
    const realData = (json.data || []).map((loc) => {
      const rawType = (loc.type || "").toLowerCase();
      
      // Tradução de tipos
      let tipoTraduzido = "fixo";
      if (rawType.includes("fix")) tipoTraduzido = "fixo";
      else if (rawType.includes("event")) tipoTraduzido = "evento";

      return {
        ...loc,
        // Adapter: nomes alternativos
        dataInicio: loc.dataInicio || loc.eventStartDate,
        dataFim: loc.dataFim || loc.eventEndDate,
        // Parse de strings para números
        latitude: parseFloat(loc.latitude),
        longitude: parseFloat(loc.longitude),
        // Tradução de tipo
        type: tipoTraduzido
      };
    });
    
    setLocals(realData);
  });
```

**Diagrama Adapter:**

```
Backend (Prisma)         Adapter              Frontend (React)
     |                      |                        |
  {nome: "X"}  ────────>  {name: "X"}  ────────>  LocalCard
  {endereco}   transform   {address}   expected   displays name
  {telefone}               {contact}   format     and address
```

**Benefícios:**
- Isola mudanças de API/DB
- Frontend não depende de formato do banco
- Facilita integração com APIs de terceiros
- Permite trabalho paralelo (contrato definido)

---

### 6.3 Resumo dos Padrões no DoaCin

| Padrão | Localização | Propósito | Benefício Principal |
|--------|-------------|-----------|---------------------|
| **Singleton** | database.js, conectaService.js | Instância única | Economia de recursos |
| **Factory** | donationsController.js | Criação dinâmica | Flexibilidade |
| **Strategy** | dashboardController.js | Algoritmos intercambiáveis | Extensibilidade |
| **Observer** | AuthContext.jsx, DashboardContext.jsx | Notificação de mudanças | Reatividade |
| **Middleware (Chain)** | auth.js, server.js | Processamento em cadeia | Composição |
| **Proxy** | api.js, conectaService.js | Controle de acesso | Segurança |
| **Adapter** | campaignLocals.js, CampaignsPage.jsx | Conversão de interface | Desacoplamento |

---

## Resumo dos Capítulos 4 e 6

### Capítulo 4: Modelos ✅
- **Engenharia Avante vs Reversa** explicada com tabela comparativa
- Exemplos práticos no DoaCin:
  - Forward: Schema Prisma, arquitetura API, componentização
  - Reverse: Análise de dependências, diagramas a partir de código
- Reengenharia (combinação de ambas)
- Quando usar cada abordagem

### Capítulo 6: Padrões de Projeto ✅
**7 Padrões Identificados e Documentados:**

1. **Singleton** - Prisma e ConectaService (análise completa)
2. **Factory** - Criação dinâmica de PontoColeta
3. **Strategy** - Cálculo de cooldown por gênero (+ refatoração proposta)
4. **Observer** - Context API do React
5. **Middleware/Chain** - Sistema de autenticação
6. **Proxy** - authFetch e Axios interceptors
7. **Adapter** - Normalização de dados API

Cada padrão inclui:
- Definição formal
- Problema que resolve
- Código real do DoaCin
- Diagramas explicativos
- Benefícios e trade-offs

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - Capítulos 4 e 6: Modelos e Padrões*
