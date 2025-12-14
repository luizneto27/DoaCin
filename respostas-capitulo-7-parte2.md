# Respostas - Capítulo 7: Arquitetura (Parte 2) aplicada ao DoaCin

## Capítulo 7: Arquitetura (Continuação)

### 7.3 Arquitetura MVC (Model-View-Controller)

#### Definição de Arquitetura MVC

**MVC** é um padrão arquitetural que separa uma aplicação em três componentes interconectados, cada um com responsabilidades distintas. Foi criado por Trygve Reenskaug em 1979 para aplicações Smalltalk e tornou-se um dos padrões mais populares em desenvolvimento web.

#### Os Três Componentes

**1. Model (Modelo):**
- Representa os **dados** e a **lógica de negócio**
- Gerencia o estado da aplicação
- Não sabe nada sobre View ou Controller
- Notifica observers quando muda (padrão Observer)

**2. View (Visão):**
- Representa a **apresentação** dos dados
- Exibe o estado do Model para o usuário
- Recebe entradas do usuário
- Não contém lógica de negócio

**3. Controller (Controlador):**
- **Orquestra** a interação entre Model e View
- Recebe entradas do usuário da View
- Atualiza o Model
- Seleciona qual View exibir

#### Estrutura Clássica do MVC

```
        ┌─────────────────────────────────────┐
        │                                     │
        │         USUÁRIO                     │
        │                                     │
        └──────────────┬──────────────────────┘
                       │
                       │ (1) Interação
                       ↓
        ┌──────────────────────────────────────┐
        │                                      │
        │           VIEW                       │
        │        (Apresentação)                │
        │                                      │
        │  - Formulários                       │
        │  - Páginas HTML                      │
        │  - Componentes UI                    │
        │                                      │
        └──────────┬───────────────────────────┘
                   │
                   │ (2) Envia eventos
                   ↓
        ┌──────────────────────────────────────┐
        │                                      │
        │         CONTROLLER                   │
        │        (Coordenador)                 │
        │                                      │
        │  - Rotas HTTP                        │
        │  - Handlers                          │
        │  - Validação de entrada              │
        │                                      │
        └──────────┬───────────────────────────┘
                   │
                   │ (3) Manipula
                   ↓
        ┌──────────────────────────────────────┐
        │                                      │
        │           MODEL                      │
        │      (Dados + Lógica)                │
        │                                      │
        │  - Classes de domínio                │
        │  - Acesso ao banco                   │
        │  - Regras de negócio                 │
        │                                      │
        └──────────┬───────────────────────────┘
                   │
                   │ (4) Notifica mudanças
                   ↓
              ┌──────────┐
              │ Database │
              └──────────┘
```

#### Fluxo de Comunicação MVC

**Fluxo Tradicional (MVC Desktop):**
```
1. Usuário interage com VIEW
   ↓
2. VIEW notifica CONTROLLER sobre ação
   ↓
3. CONTROLLER atualiza MODEL
   ↓
4. MODEL notifica VIEW sobre mudança (Observer)
   ↓
5. VIEW consulta MODEL e se atualiza
```

**Fluxo Web (MVC Web - mais comum):**
```
1. Usuário faz requisição HTTP (View = Browser)
   ↓
2. CONTROLLER recebe requisição
   ↓
3. CONTROLLER consulta/atualiza MODEL
   ↓
4. CONTROLLER seleciona VIEW apropriada
   ↓
5. VIEW é renderizada com dados do MODEL
   ↓
6. HTML é enviado ao browser
```

#### Variações do MVC

**1. MVC Tradicional (Passive View):**
- View é "burra" (apenas apresentação)
- Controller tem toda a lógica

**2. MVP (Model-View-Presenter):**
- Presenter substitui Controller
- View é completamente passiva
- Presenter contém lógica de apresentação

**3. MVVM (Model-View-ViewModel):**
- ViewModel substitui Controller
- Data binding bidirecional
- Popular em frameworks modernos (Vue, Angular)

**4. MVC Moderno (React/Frontend):**
- Model = Estado (State)
- View = Componentes React
- Controller = Hooks, Event Handlers

#### Exemplo Clássico de MVC

**Cenário: Sistema de Blog**

```javascript
// ============================================
// MODEL - Representa um Post do Blog
// ============================================

class Post {
  constructor(id, title, content, author) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = new Date();
    this.observers = []; // Padrão Observer
  }
  
  // Lógica de negócio
  updateContent(newContent) {
    this.content = newContent;
    this.notifyObservers(); // Notifica Views
  }
  
  // Validação de domínio
  isValid() {
    return this.title.length > 0 && this.content.length > 0;
  }
  
  // Padrão Observer
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  notifyObservers() {
    this.observers.forEach(obs => obs.update(this));
  }
}

// Repository (parte do Model)
class PostRepository {
  constructor(database) {
    this.db = database;
  }
  
  async findById(id) {
    return await this.db.posts.findOne({ id });
  }
  
  async save(post) {
    return await this.db.posts.create(post);
  }
}


// ============================================
// VIEW - Apresentação HTML
// ============================================

class PostView {
  constructor(model) {
    this.model = model;
    this.model.subscribe(this); // Observer pattern
  }
  
  // Renderiza HTML
  render() {
    return `
      <article class="post">
        <h1>${this.model.title}</h1>
        <p class="author">Por: ${this.model.author}</p>
        <div class="content">${this.model.content}</div>
        <button onclick="editPost(${this.model.id})">Editar</button>
      </article>
    `;
  }
  
  // Atualiza quando Model muda (Observer)
  update(model) {
    this.model = model;
    document.getElementById('post-container').innerHTML = this.render();
  }
}


// ============================================
// CONTROLLER - Orquestra Model e View
// ============================================

class PostController {
  constructor(postRepository) {
    this.repository = postRepository;
  }
  
  // Handler de requisição HTTP
  async showPost(req, res) {
    const postId = req.params.id;
    
    // 1. Busca dados no Model
    const post = await this.repository.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    // 2. Cria View
    const view = new PostView(post);
    
    // 3. Renderiza e retorna
    res.send(view.render());
  }
  
  async updatePost(req, res) {
    const postId = req.params.id;
    const { content } = req.body;
    
    // 1. Busca Model
    const post = await this.repository.findById(postId);
    
    // 2. Atualiza Model (lógica de negócio)
    post.updateContent(content);
    
    // 3. Valida
    if (!post.isValid()) {
      return res.status(400).json({ error: 'Conteúdo inválido' });
    }
    
    // 4. Persiste
    await this.repository.save(post);
    
    // 5. Retorna sucesso
    res.json({ success: true, post });
  }
}


// ============================================
// Uso (Routes)
// ============================================

const postRepository = new PostRepository(database);
const postController = new PostController(postRepository);

app.get('/posts/:id', (req, res) => postController.showPost(req, res));
app.put('/posts/:id', (req, res) => postController.updatePost(req, res));
```

---

#### Arquitetura MVC no DoaCin

**Resposta: PARCIALMENTE. O DoaCin possui elementos do padrão MVC, mas não segue o padrão clássico de forma pura. Ele implementa uma variante moderna que combina MVC no backend (Express) com uma arquitetura de componentes no frontend (React).**

##### Análise da Estrutura MVC no DoaCin

**Mapeamento dos Componentes:**

```
┌══════════════════════════════════════════════════════════════┐
│                    DoaCin - MVC Híbrido                      │
├══════════════════════════════════════════════════════════════┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    VIEW (Frontend)                     │ │
│  │                    React Components                    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  src/pages/                                            │ │
│  │  ├── HomePage.jsx          ← View da Dashboard        │ │
│  │  ├── DonationsPage.jsx     ← View de Doações          │ │
│  │  ├── CampaignsPage.jsx     ← View de Campanhas        │ │
│  │  ├── LoginPage.jsx         ← View de Login            │ │
│  │  └── ProfilePage.jsx       ← View de Perfil           │ │
│  │                                                        │ │
│  │  src/components/                                       │ │
│  │  ├── StatCard.jsx          ← Subview                  │ │
│  │  ├── DonationHistoryItem   ← Subview                  │ │
│  │  └── LocalCard.jsx         ← Subview                  │ │
│  │                                                        │ │
│  │  RESPONSABILIDADE:                                     │ │
│  │  - Apresentação de dados                               │ │
│  │  - Captura de entrada do usuário                      │ │
│  │  - Renderização de UI                                 │ │
│  │  - Eventos de interação                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓ HTTP                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 CONTROLLER (Backend)                   │ │
│  │                  Express Controllers                   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  routes/controllers/                                   │ │
│  │  ├── authController.js     ← Auth Controller          │ │
│  │  │   ├── login()                                       │ │
│  │  │   └── register()                                    │ │
│  │  │                                                     │ │
│  │  ├── dashboardController   ← Dashboard Controller     │ │
│  │  │   └── getDashboardStats()                          │ │
│  │  │                                                     │ │
│  │  ├── donationsController   ← Donations Controller     │ │
│  │  │   ├── getDonationHistory()                         │ │
│  │  │   ├── createDonation()                             │ │
│  │  │   └── confirmDonation()                            │ │
│  │  │                                                     │ │
│  │  └── userController        ← User Controller          │ │
│  │      └── updateProfile()                              │ │
│  │                                                        │ │
│  │  RESPONSABILIDADE:                                     │ │
│  │  - Receber requisições HTTP                           │ │
│  │  - Validar entrada                                    │ │
│  │  - Orquestrar chamadas ao Model                       │ │
│  │  - Retornar resposta (JSON)                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓ Prisma                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    MODEL (Backend)                     │ │
│  │              Prisma Schema + Database                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  prisma/schema.prisma                                  │ │
│  │  ├── model User            ← Model de Usuário         │ │
│  │  ├── model Donation        ← Model de Doação          │ │
│  │  ├── model PontoColeta     ← Model de Local           │ │
│  │  ├── model Agendamento     ← Model de Agendamento     │ │
│  │  └── model Quiz            ← Model de Quiz            │ │
│  │                                                        │ │
│  │  config/database.js        ← PrismaClient             │ │
│  │                                                        │ │
│  │  RESPONSABILIDADE:                                     │ │
│  │  - Definir estrutura de dados                         │ │
│  │  - Validações de integridade                          │ │
│  │  - Relacionamentos entre entidades                    │ │
│  │  - Persistência no banco                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│                   ┌──────────────┐                          │
│                   │  PostgreSQL  │                          │
│                   └──────────────┘                          │
└══════════════════════════════════════════════════════════════┘
```

##### Exemplo Concreto: Fluxo MVC no DoaCin

**Cenário: Atualizar Perfil de Usuário**

```javascript
// ═══════════════════════════════════════════════════════════
// VIEW - src/pages/ProfilePage.jsx
// ═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { authFetch } from '../../services/api';

function ProfilePage() {
  // Estado local da View (não é Model)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [peso, setPeso] = useState('');
  
  // Handler de evento (parte da View, mas chama Controller)
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Dados coletados da View
    const dadosParaEnviar = {
      telefone: telefone,
      peso: peso,
    };
    
    try {
      // CHAMA CONTROLLER via HTTP
      const response = await authFetch('/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(dadosParaEnviar),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar o perfil');
      }
      
      alert('Perfil salvo com sucesso!');
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar o perfil.');
    }
  };
  
  // RENDERIZAÇÃO (responsabilidade da View)
  return (
    <div className="profile-page">
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
        />
        
        <label>Telefone:</label>
        <input 
          type="tel" 
          value={telefone} 
          onChange={(e) => setTelefone(e.target.value)} 
        />
        
        <label>Peso (kg):</label>
        <input 
          type="number" 
          value={peso} 
          onChange={(e) => setPeso(e.target.value)} 
        />
        
        <button type="submit">Salvar Perfil</button>
      </form>
    </div>
  );
}

export default ProfilePage;

// RESPONSABILIDADE DA VIEW:
// ✓ Capturar entrada do usuário
// ✓ Exibir dados
// ✓ Validação básica de UI
// ✗ NÃO contém lógica de negócio
// ✗ NÃO acessa banco diretamente


// ═══════════════════════════════════════════════════════════
// CONTROLLER - routes/controllers/userController.js
// ═══════════════════════════════════════════════════════════

import prisma from '../../config/database.js';

export const updateProfile = async (req, res) => {
  // 1. EXTRAI DADOS DA REQUISIÇÃO
  const userId = req.user.userId; // Do JWT (middleware)
  const { telefone, peso, dataNascimento, tipoRed, genero } = req.body;
  
  try {
    // 2. BUSCA MODEL ATUAL
    const userAtual = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!userAtual) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }
    
    // 3. PREPARA DADOS PARA ATUALIZAÇÃO
    const dadosAtualizacao = {};
    
    if (telefone !== undefined) dadosAtualizacao.phone = telefone;
    if (peso !== undefined) dadosAtualizacao.weight = parseFloat(peso);
    if (tipoRed !== undefined) dadosAtualizacao.bloodType = tipoRed;
    if (genero !== undefined) dadosAtualizacao.genero = genero;
    
    if (dataNascimento) {
      // Converte DD/MM/YYYY para Date
      const [dia, mes, ano] = dataNascimento.split('/');
      dadosAtualizacao.birthDate = new Date(`${ano}-${mes}-${dia}`);
    }
    
    // 4. ATUALIZA MODEL
    const userAtualizado = await prisma.user.update({
      where: { id: userId },
      data: dadosAtualizacao
    });
    
    // 5. RETORNA RESPOSTA (DTO)
    res.status(200).json({
      message: 'Perfil atualizado com sucesso',
      user: {
        nome: userAtualizado.nome,
        email: userAtualizado.email,
        phone: userAtualizado.phone,
        weight: userAtualizado.weight,
        bloodType: userAtualizado.bloodType
      }
    });
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar perfil' 
    });
  }
};

// RESPONSABILIDADE DO CONTROLLER:
// ✓ Receber requisição HTTP
// ✓ Validar autenticação (via middleware)
// ✓ Orquestrar busca e atualização do Model
// ✓ Transformar dados (DTO)
// ✓ Retornar resposta HTTP
// ✗ NÃO contém SQL direto (delega ao Model/Prisma)


// ═══════════════════════════════════════════════════════════
// MODEL - prisma/schema.prisma
// ═══════════════════════════════════════════════════════════

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
  genero            String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  donations         Donation[]
  agendamentos      Agendamento[]
  
  // VALIDAÇÕES E CONSTRAINTS (parte do Model)
  @@index([email])
  @@index([cpf])
}

// RESPONSABILIDADE DO MODEL:
// ✓ Definir estrutura de dados
// ✓ Constraints (unique, required)
// ✓ Relacionamentos
// ✓ Índices para performance
// ✓ Timestamps automáticos

// O Prisma gera automaticamente:
// - Métodos CRUD (findUnique, create, update, delete)
// - Validações de tipo
// - Transações
// - Migrações de schema


// ═══════════════════════════════════════════════════════════
// ROTAS - routes/user.js (parte da infraestrutura MVC)
// ═══════════════════════════════════════════════════════════

import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';
import { updateProfile } from './controllers/userController.js';

const router = express.Router();

// Define rota HTTP → Controller
router.put('/me', authMiddleware, updateProfile);
//                 ↑ Middleware      ↑ Controller

export default router;


// ═══════════════════════════════════════════════════════════
// FLUXO COMPLETO (MVC no DoaCin)
// ═══════════════════════════════════════════════════════════

/*
1. Usuário preenche formulário na VIEW (ProfilePage.jsx)
   └─ Clica em "Salvar Perfil"
   
2. VIEW captura evento e envia PUT /api/user/me
   └─ authFetch('/api/user/me', { method: 'PUT', body: {...} })
   
3. Requisição chega no BACKEND
   └─ Express roteia para router.put('/me', ...)
   
4. Middleware de autenticação verifica JWT
   └─ authMiddleware anexa req.user.userId
   
5. CONTROLLER recebe requisição
   └─ updateProfile(req, res) é executado
   
6. CONTROLLER busca MODEL atual
   └─ await prisma.user.findUnique({ where: { id: userId } })
   
7. MODEL (Prisma) executa SQL
   └─ SELECT * FROM "User" WHERE id = $1
   
8. CONTROLLER valida e prepara dados
   └─ dadosAtualizacao = { phone: ..., weight: ... }
   
9. CONTROLLER atualiza MODEL
   └─ await prisma.user.update({ where: {...}, data: {...} })
   
10. MODEL (Prisma) executa SQL
    └─ UPDATE "User" SET phone = $1, weight = $2 WHERE id = $3
    
11. CONTROLLER formata resposta (DTO)
    └─ res.json({ message: 'Sucesso', user: {...} })
    
12. VIEW recebe resposta
    └─ alert('Perfil salvo com sucesso!')
    
13. VIEW pode re-renderizar com novos dados
    └─ setNome(data.user.nome) [se necessário]
*/
```

##### Onde o DoaCin Segue o Padrão MVC

**✓ Separação de Responsabilidades:**

| Componente | No DoaCin | Seguindo MVC? |
|------------|-----------|---------------|
| **View** | React Components (src/pages, src/components) | ✓ Sim |
| **Controller** | Express Controllers (routes/controllers) | ✓ Sim |
| **Model** | Prisma Schema + Database | ✓ Sim |

**✓ Fluxo de Comunicação:**
```
User → View (React) → HTTP → Controller (Express) → Model (Prisma) → DB
                                         ↓
User ← View (React) ← HTTP ← Controller (JSON Response)
```

**✓ Controllers Orquestram:**

```javascript
// Dashboard Controller orquestra múltiplas consultas ao Model
export const getDashboardStats = async (req, res) => {
  const user = await prisma.user.findUnique(...);      // Model 1
  const stats = await prisma.donation.aggregate(...);  // Model 2
  const lastDonation = await prisma.donation.findFirst(...); // Model 3
  
  // Orquestra e retorna
  res.json({ user, stats, lastDonation });
};
```

**✓ Models Encapsulam Dados:**

```prisma
// Schema define estrutura e relacionamentos
model Donation {
  id                String    @id @default(uuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  pontoColetaId     String
  pontoColeta       PontoColeta @relation(fields: [pontoColetaId], references: [id])
  status            String    @default("pending")
  
  // Validações e constraints aqui
}
```

##### Onde o DoaCin Difere do MVC Clássico

**✗ View não observa Model diretamente:**

```javascript
// MVC CLÁSSICO (Observer Pattern):
// Model notifica View automaticamente quando muda

model.on('change', () => {
  view.update(model);
});

// DoaCin (REST API):
// View precisa fazer nova requisição HTTP para atualizar

useEffect(() => {
  fetchDashboard();  // Polling manual
}, []);

// DIFERENÇA: No MVC clássico, a notificação é automática
// No DoaCin (web), é baseada em requisições HTTP
```

**✗ React usa Padrão de Componentes (não MVC puro):**

```javascript
// React Components != MVC Views tradicionais

// React mistura View + Controller (nos hooks)
function ProfilePage() {
  // Estado (mini-model local)
  const [nome, setNome] = useState('');
  
  // Handler (mini-controller)
  const handleSubmit = () => {
    // Lógica de apresentação
  };
  
  // Render (view)
  return <form>...</form>;
}

// No MVC clássico, View e Controller são completamente separados
```

**✗ Lógica de Negócio às vezes está no Controller:**

```javascript
// ✗ IDEAL seria ter Service Layer separado

// ATUAL (lógica no Controller):
export const getDashboardStats = async (req, res) => {
  const user = await prisma.user.findUnique(...);
  
  // Lógica de negócio aqui (deveria estar em Service)
  const minimumInterval = user.genero === 'M' ? 60 : 90;
  const daysUntilNextDonation = Math.max(0, minimumInterval - daysSince);
  
  res.json({ daysUntilNextDonation });
};

// IDEAL (com Service):
export const getDashboardStats = async (req, res) => {
  const dashboardService = new DashboardService();
  const stats = await dashboardService.getStatsForUser(userId);
  res.json(stats);
};
```

##### Comparação: MVC Clássico vs DoaCin

| Aspecto | MVC Clássico | DoaCin |
|---------|--------------|--------|
| **Arquitetura** | Desktop/Server-side rendering | REST API + SPA |
| **View** | Templates server-side | React Components |
| **Controller** | Classe com métodos | Express route handlers |
| **Model** | Classes OOP | Prisma Schema |
| **Comunicação** | Chamadas diretas (memória) | HTTP/REST |
| **Estado** | Model notifica View (Observer) | State management (React) |
| **Renderização** | Server-side | Client-side |
| **Validação** | Controller + Model | Controller + Frontend |

##### Variante Moderna: MVC + REST + SPA

O DoaCin implementa uma variante moderna:

```
┌─────────────────────────────────────────────────────────┐
│              MVC CLÁSSICO (Desktop)                     │
├─────────────────────────────────────────────────────────┤
│  View ←→ Controller ←→ Model ←→ Database               │
│  (Mesmo processo, mesma memória)                        │
└─────────────────────────────────────────────────────────┘

            vs

┌─────────────────────────────────────────────────────────┐
│           DoaCin (MVC Web Moderno)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐         ┌───────────────────────┐ │
│  │   FRONTEND      │         │      BACKEND          │ │
│  │   (Browser)     │         │      (Server)         │ │
│  │                 │         │                       │ │
│  │  View (React)   │ ←─────→ │  Controller (Express) │ │
│  │                 │  HTTP   │        ↕               │ │
│  │  (+ mini-       │  REST   │  Model (Prisma)       │ │
│  │   controller    │  JSON   │        ↕               │ │
│  │   local)        │         │  Database (PostgreSQL)│ │
│  └─────────────────┘         └───────────────────────┘ │
│                                                         │
│  Cliente                      Servidor                 │
└─────────────────────────────────────────────────────────┘
```

##### Benefícios do MVC no DoaCin

**1. Organização Clara:**
```
routes/controllers/  ← Controllers isolados
prisma/schema.prisma ← Model centralizado
src/pages/          ← Views organizadas
```

**2. Testabilidade:**
```javascript
// Testar Controller isoladamente
describe('updateProfile', () => {
  it('deve atualizar telefone', async () => {
    // Mock do Model (Prisma)
    prisma.user.update = jest.fn().mockResolvedValue({...});
    
    await updateProfile(mockReq, mockRes);
    
    expect(mockRes.json).toHaveBeenCalled();
  });
});

// Testar View isoladamente
describe('ProfilePage', () => {
  it('deve renderizar formulário', () => {
    render(<ProfilePage />);
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
  });
});
```

**3. Manutenibilidade:**
- Mudança no banco? → Apenas Model (Prisma schema)
- Mudança na UI? → Apenas View (React components)
- Mudança na lógica? → Apenas Controller

**4. Separação de Equipes:**
- Time Frontend: React (Views)
- Time Backend: Express (Controllers)
- DBA: PostgreSQL + Prisma (Model)

---

### 7.4 SPA (Single Page Application)

#### Definição de SPA

**Single Page Application (SPA)** é uma aplicação web que funciona dentro de uma **única página HTML**, onde todo o conteúdo é carregado dinamicamente via JavaScript, sem recarregar a página inteira durante a navegação.

#### Características Fundamentais

**1. Uma Única Página HTML:**
```html
<!-- index.html - ÚNICO arquivo HTML -->
<!DOCTYPE html>
<html>
  <head>
    <title>DoaCin</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Todo conteúdo é injetado aqui via JavaScript -->
    <script src="/src/main.jsx" type="module"></script>
  </body>
</html>
```

**2. Roteamento Client-Side:**
- Navegação sem recarregar página
- URL muda, mas página não recarrega
- JavaScript gerencia o roteamento

**3. Comunicação via API:**
- Backend fornece apenas dados (JSON)
- Frontend renderiza a UI
- Desacoplamento total

**4. Carregamento Inicial:**
- Primeira carga baixa todo JavaScript/CSS
- Navegações subsequentes são instantâneas
- Lazy loading para otimização

#### SPA vs MPA (Multi-Page Application)

```
┌─────────────────────────────────────────────────────────┐
│           MPA (Aplicação Tradicional)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Usuário clica em "Doações"                            │
│       ↓                                                 │
│  Browser envia GET /doacoes                             │
│       ↓                                                 │
│  Servidor renderiza HTML completo                       │
│       ↓                                                 │
│  Página RECARREGA totalmente                            │
│       ↓                                                 │
│  Nova página HTML exibida                               │
│                                                         │
│  PROBLEMA:                                              │
│  - Página pisca (branco durante carregamento)           │
│  - Recarrega CSS/JS novamente                           │
│  - Perde estado da aplicação                            │
│  - Experiência desconexa                                │
│                                                         │
└─────────────────────────────────────────────────────────┘

                     vs

┌─────────────────────────────────────────────────────────┐
│               SPA (Aplicação Moderna)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Usuário clica em "Doações"                            │
│       ↓                                                 │
│  React Router muda URL (client-side)                    │
│       ↓                                                 │
│  JavaScript renderiza componente <DonationsPage />      │
│       ↓                                                 │
│  AJAX busca dados: GET /api/donations                   │
│       ↓                                                 │
│  JSON retorna, componente re-renderiza                  │
│       ↓                                                 │
│  Conteúdo atualiza SEM recarregar página               │
│                                                         │
│  BENEFÍCIO:                                             │
│  - Transição suave (sem piscar)                         │
│  - CSS/JS já estão carregados                           │
│  - Mantém estado global (auth, etc)                     │
│  - Experiência fluida (app-like)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Tecnologias Comuns para SPAs

| Framework/Biblioteca | Descrição | Usado no DoaCin? |
|---------------------|-----------|------------------|
| **React** | Biblioteca de componentes | ✓ Sim (19.1.1) |
| **Vue.js** | Framework progressivo | ✗ Não |
| **Angular** | Framework completo (Google) | ✗ Não |
| **Svelte** | Compilador de componentes | ✗ Não |
| **React Router** | Roteamento client-side | ✓ Sim (7.9.5) |
| **Redux/Context** | Gerenciamento de estado | ✓ Context API |

#### Arquitetura de uma SPA

```
┌═══════════════════════════════════════════════════════════┐
│                      BROWSER                              │
├═══════════════════════════════════════════════════════════┤
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           index.html (ÚNICO HTML)                   │ │
│  │                                                     │ │
│  │  <div id="root">                                    │ │
│  │    <!-- React injeta conteúdo aqui -->             │ │
│  │  </div>                                             │ │
│  └─────────────────────────────────────────────────────┘ │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │          Bundle JavaScript (app.js)                 │ │
│  │                                                     │ │
│  │  - React                                            │ │
│  │  - React Router                                     │ │
│  │  - Todos os componentes                             │ │
│  │  - Lógica de roteamento                             │ │
│  │  - Estado global (Context)                          │ │
│  └─────────────────────────────────────────────────────┘ │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │            Router (React Router)                    │ │
│  │                                                     │ │
│  │  / → <HomePage />                                   │ │
│  │  /doacoes → <DonationsPage />                       │ │
│  │  /campanhas → <CampaignsPage />                     │ │
│  │  /login → <LoginPage />                             │ │
│  └─────────────────────────────────────────────────────┘ │
│                         ↓                                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │         Componente Ativo (renderizado)              │ │
│  │                                                     │ │
│  │  Exemplo: <DonationsPage />                         │ │
│  │    ├─ useState() - estado local                     │ │
│  │    ├─ useEffect() - busca dados                     │ │
│  │    └─ JSX - renderiza UI                            │ │
│  └─────────────────────────────────────────────────────┘ │
│                         ↓ fetch/axios                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              API Client (authFetch)                 │ │
│  │                                                     │ │
│  │  GET /api/donations → JSON                          │ │
│  │  POST /api/auth/login → JWT                         │ │
│  └─────────────────────────────────────────────────────┘ │
└═══════════════════════════════════════════════════════════┘
                         ↓ HTTP
┌═══════════════════════════════════════════════════════════┐
│                      SERVIDOR                             │
├═══════════════════════════════════════════════════════════┤
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           REST API (Express)                        │ │
│  │                                                     │ │
│  │  GET /api/donations → JSON array                    │ │
│  │  POST /api/donations → Creates record               │ │
│  │                                                     │ │
│  │  NÃO retorna HTML, apenas JSON                      │ │
│  └─────────────────────────────────────────────────────┘ │
└═══════════════════════════════════════════════════════════┘
```

#### O DoaCin é uma SPA?

**Resposta: SIM, o DoaCin é uma Single Page Application (SPA) construída com React.**

##### Evidências de que DoaCin é uma SPA

**1. Arquivo HTML Único**

```html
<!-- index.html - ÚNICO arquivo HTML no projeto -->
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DoaCin - Sistema de Doação de Sangue</title>
  </head>
  <body>
    <!-- Container único onde React injeta todo conteúdo -->
    <div id="root"></div>
    
    <!-- Script que carrega toda aplicação React -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

<!-- EVIDÊNCIA: Não há outros arquivos .html no projeto -->
```

**2. React Router para Navegação Client-Side**

```jsx
// src/App.jsx - Roteamento client-side

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {/* TODAS as rotas renderizadas client-side */}
            <Route path="/" element={<HomePage />} />
            <Route path="/doacoes" element={<DonationsPage />} />
            <Route path="/campanhas" element={<CampaignsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/regras" element={<RulesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// EVIDÊNCIA: Navegação entre rotas NÃO recarrega página
// URL muda (/doacoes → /campanhas) mas sem page refresh
```

**3. Comunicação via API REST (JSON)**

```javascript
// src/pages/DonationsPage.jsx

import { authFetch } from '../../services/api';

function DonationsPage() {
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    // Busca APENAS dados (JSON), não HTML
    authFetch('/api/donations', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        setDonations(data);  // Atualiza estado
        // Componente re-renderiza automaticamente
      });
  }, []);
  
  return (
    <div>
      {/* JavaScript renderiza HTML dinamicamente */}
      {donations.map(donation => (
        <DonationHistoryItem key={donation.id} donation={donation} />
      ))}
    </div>
  );
}

// EVIDÊNCIA: Backend retorna JSON, não HTML
// Frontend (React) renderiza a UI
```

**4. Build Gera Bundle JavaScript**

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}

// Executar: npm run build
// Resultado:
// dist/
//   ├── index.html              ← Único HTML
//   ├── assets/
//   │   ├── index-abc123.js     ← Bundle JavaScript (TODA a app)
//   │   └── index-def456.css    ← Bundle CSS
```

**Bundle gerado contém:**
- Todo código React
- Todos os componentes
- React Router
- Lógica de estado (Context API)
- Bibliotecas (Leaflet, Axios)

**5. Navegação Sem Recarregamento**

```
TESTE PRÁTICO:

1. Abrir DoaCin no browser
2. Abrir DevTools → Network tab
3. Navegar: Home → Doações → Campanhas → Perfil

RESULTADO:
- URL muda: localhost:5173/ → /doacoes → /campanhas → /perfil
- Página NÃO recarrega (sem flash branco)
- Network tab mostra APENAS requisições AJAX (GET /api/donations)
- NÃO mostra carregamento de novos HTMLs

EVIDÊNCIA: É uma SPA
```

**6. Estado Mantido Durante Navegação**

```jsx
// src/context/AuthContext.jsx

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Estado PERSISTE durante toda a sessão
  // Não é perdido ao navegar entre páginas
  
  return (
    <AuthContext.Provider value={{ token, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// TESTE:
// 1. Login → token armazenado
// 2. Navegar para /doacoes
// 3. Navegar para /campanhas
// 4. Token ainda existe (não foi perdido)

// EM MPA: Token seria perdido a cada navegação
// EM SPA: Token persiste na memória JavaScript
```

##### Diagrama: Ciclo de Vida do DoaCin (SPA)

```
┌─────────────────────────────────────────────────────────┐
│              CARREGAMENTO INICIAL (First Load)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Browser acessa http://localhost:5173/               │
│       ↓                                                 │
│  2. Vite serve index.html                               │
│       ↓                                                 │
│  3. Browser baixa /src/main.jsx (bundle)                │
│       ↓                                                 │
│  4. React renderiza <App />                             │
│       ↓                                                 │
│  5. React Router detecta URL ("/")                      │
│       ↓                                                 │
│  6. Renderiza <HomePage />                              │
│       ↓                                                 │
│  7. useEffect() busca GET /api/dashboard                │
│       ↓                                                 │
│  8. Página totalmente carregada                         │
│                                                         │
│  TEMPO: ~2-3 segundos (carregamento de todo JavaScript)│
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            NAVEGAÇÕES SUBSEQUENTES (Instant)            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Usuário clica em "Doações" (sidebar)                │
│       ↓                                                 │
│  2. React Router intercepta clique                      │
│       ↓                                                 │
│  3. URL muda para /doacoes (pushState)                  │
│       ↓                                                 │
│  4. React desmonta <HomePage />                         │
│       ↓                                                 │
│  5. React monta <DonationsPage />                       │
│       ↓                                                 │
│  6. useEffect() busca GET /api/donations                │
│       ↓                                                 │
│  7. Lista de doações renderizada                        │
│                                                         │
│  TEMPO: ~100-300ms (apenas troca de componente)         │
│  SEM page reload!                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

##### Vantagens do DoaCin como SPA

**1. Experiência de Usuário Superior:**
- Transições suaves entre páginas
- Sem flash branco durante navegação
- Interface responsiva e fluida
- Sensação de aplicativo nativo

**2. Performance Após Carregamento Inicial:**
```
Carregamento inicial: 2-3s (baixa todo JavaScript)
Navegações posteriores: <100ms (troca componentes)
```

**3. Separação Frontend/Backend:**
```
Frontend (React): Roda no browser do usuário
Backend (Express): Roda no servidor

Benefício: Podem ser desenvolvidos/deployados independentemente
```

**4. Offline Capabilities (potencial):**
```javascript
// Com Service Workers, SPA pode funcionar offline
// Caching de assets estáticos
// Sync quando reconectar
```

**5. State Management Simplificado:**
```jsx
// Estado persiste na memória durante toda sessão
const [donations, setDonations] = useState([]);

// Em MPA: Teria que usar cookies/session storage
```

##### Desvantagens do DoaCin como SPA

**1. SEO (Search Engine Optimization):**
```html
<!-- Crawler de Google vê apenas: -->
<div id="root"></div>

<!-- Conteúdo é gerado por JavaScript (dificulta indexação) -->

SOLUÇÃO: SSR (Server-Side Rendering) com Next.js
(DoaCin não precisa, não é site público de conteúdo)
```

**2. Carregamento Inicial Lento:**
```
Primeira visita: Baixa TODO o JavaScript (~500KB-2MB)
MPA: Baixa apenas HTML da página específica (~50KB)

MITIGAÇÃO:
- Code splitting (lazy loading)
- Tree shaking
- Minificação
```

**3. JavaScript Obrigatório:**
```
Se JavaScript estiver desabilitado:
  → DoaCin não funciona (tela branca)

MPA funcionaria parcialmente
```

**4. Complexidade de Roteamento:**
```javascript
// SPA: Precisa gerenciar roteamento manualmente
<Route path="/doacoes" element={<DonationsPage />} />

// MPA: Servidor gerencia automaticamente
// GET /doacoes.html → retorna página
```

##### Alternativas ao SPA

**1. MPA (Multi-Page Application):**
```
Exemplo: WordPress, sites tradicionais
- Cada página é um HTML separado
- Servidor renderiza HTML
- Navegação recarrega página
```

**2. SSR (Server-Side Rendering):**
```
Exemplo: Next.js, Nuxt.js
- Renderização no servidor
- SEO-friendly
- Entrega HTML pronto
- Hidratação no client
```

**3. SSG (Static Site Generation):**
```
Exemplo: Gatsby, Hugo
- Gera HTMLs estáticos em build time
- Performance máxima
- SEO perfeito
- Ideal para blogs/docs
```

**4. Islands Architecture:**
```
Exemplo: Astro
- HTML estático com "ilhas" interativas
- JavaScript apenas onde necessário
- Melhor de ambos os mundos
```

##### Por que DoaCin Escolheu SPA?

| Razão | Justificativa |
|-------|---------------|
| **Aplicação Web App** | Não é site de conteúdo, é aplicativo |
| **Interatividade Alta** | Mapas, dashboards, formulários dinâmicos |
| **SEO Irrelevante** | Sistema privado, não precisa de Google |
| **UX Prioridade** | Transições suaves são essenciais |
| **Estado Complexo** | Auth, dashboard data, etc. |
| **Tecnologia Moderna** | React é padrão da indústria |

---

## Resumo do Capítulo 7 (Parte 2)

### 7.3 Arquitetura MVC ✅
- **Definição completa** dos 3 componentes (Model, View, Controller)
- **Estrutura clássica** com diagrama e fluxo de comunicação
- **4 variações** do MVC (Tradicional, MVP, MVVM, React)
- **Exemplo clássico** completo (Sistema de Blog)

**Análise do DoaCin:**
- **Resposta: PARCIALMENTE** (MVC híbrido moderno)
- **Mapeamento completo**:
  - View: React Components
  - Controller: Express Controllers
  - Model: Prisma Schema + PostgreSQL
- **Exemplo concreto**: Atualizar perfil (código completo das 3 camadas)
- **Onde segue MVC**: Separação, fluxo, orquestração
- **Onde difere**: View não observa Model, React usa componentes, lógica nos controllers
- **Comparação**: MVC Clássico vs DoaCin (tabela)
- **Variante moderna**: MVC + REST + SPA

### 7.4 SPA (Single Page Application) ✅
- **Definição** com 4 características fundamentais
- **SPA vs MPA** (comparação visual detalhada)
- **Tecnologias** comuns (tabela)
- **Arquitetura** completa de uma SPA

**Análise do DoaCin:**
- **Resposta: SIM, é uma SPA**
- **6 evidências concretas**:
  1. Arquivo HTML único (index.html)
  2. React Router (navegação client-side)
  3. Comunicação via JSON (REST API)
  4. Build gera bundle JavaScript
  5. Navegação sem recarregamento
  6. Estado mantido durante navegação
- **Diagrama**: Ciclo de vida completo (first load + navegações)
- **Vantagens**: UX superior, performance, separação, state management
- **Desvantagens**: SEO, carregamento inicial, JavaScript obrigatório
- **4 alternativas**: MPA, SSR, SSG, Islands Architecture
- **Por que SPA?**: 6 justificativas para escolha

**Total de exemplos de código**: 20+
**Diagramas e tabelas**: 10+
**Análise completa**: MVC Híbrido + SPA Moderna

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - Capítulo 7: Arquitetura (Parte 2 - MVC e SPA)*
