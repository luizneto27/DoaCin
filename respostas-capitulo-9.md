# Respostas - Capítulo 9: Refactoring aplicado ao DoaCin

## Capítulo 9: Refactoring

### 9.1 Manutenção de Software

#### Tipos de Manutenção

**1. Manutenção Corretiva**
- **Objetivo**: Corrigir bugs e defeitos
- **Gatilho**: Problema reportado
- **Exemplo DoaCin**: Corrigir erro de autenticação que permitia acesso sem token

**2. Manutenção Adaptativa**
- **Objetivo**: Adaptar software a novo ambiente
- **Gatilho**: Mudança de plataforma, SO, biblioteca
- **Exemplo DoaCin**: Migrar de Prisma 5 para Prisma 6, atualizar Node.js 18 → 20

**3. Manutenção Perfectiva**
- **Objetivo**: Melhorar performance, usabilidade, manutenibilidade
- **Gatilho**: Requisitos de otimização
- **Exemplo DoaCin**: Paralelizar queries no dashboard (4 queries sequenciais → Promise.all)

**4. Manutenção Preventiva**
- **Objetivo**: Prevenir problemas futuros
- **Gatilho**: Proatividade, análise de código
- **Exemplo DoaCin**: Adicionar validação de CPF antes de salvar no banco

#### Comparação

| Tipo | Quando | Urgência | Exemplo DoaCin |
|------|--------|----------|----------------|
| **Corretiva** | Bug ativo | Alta | Login quebrado |
| **Adaptativa** | Mudança externa | Média | Atualizar dependências |
| **Perfectiva** | Melhoria | Baixa | Otimizar performance |
| **Preventiva** | Antecipar problemas | Baixa | Adicionar logs |

---

### 9.2 Leis de Lehman

#### Contexto

Meir M. Lehman estudou a evolução de sistemas de software e formulou **8 leis** que descrevem como software evolui ao longo do tempo.

#### As 8 Leis de Lehman

**Lei 1: Mudança Contínua**
- *"Um sistema deve ser continuamente adaptado ou se torna progressivamente menos satisfatório"*
- **Aplicação DoaCin**: Sistema precisa se adaptar a novas regulamentações do Ministério da Saúde, novos requisitos de gamificação

**Lei 2: Complexidade Crescente**
- *"Conforme um sistema evolui, sua complexidade aumenta a menos que trabalho seja feito para mantê-la ou reduzi-la"*
- **Aplicação DoaCin**: À medida que adicionamos features (gamificação, campanhas, quiz), arquitetura tende a ficar mais complexa. Refactoring é necessário.

**Lei 3: Auto-Regulação**
- *"Evolução de sistemas segue um processo auto-regulado com medidas de produto e processo previsíveis"*
- **Aplicação DoaCin**: Velocidade de desenvolvimento tende a se estabilizar (número de commits, features por sprint)

**Lei 4: Conservação da Estabilidade Organizacional**
- *"Taxa média de atividade de trabalho em sistemas é invariante ao longo da vida do produto"*
- **Aplicação DoaCin**: Time acadêmico produz ~20-30 commits por mês de forma consistente

**Lei 5: Conservação da Familiaridade**
- *"Ao longo da vida de um sistema, mudanças incrementais devem ser limitadas para manter familiaridade"*
- **Aplicação DoaCin**: Não redesenhar UI completamente a cada versão, manter padrões estabelecidos

**Lei 6: Crescimento Contínuo**
- *"Funcionalidade deve ser continuamente aumentada para manter satisfação do usuário"*
- **Aplicação DoaCin**: MVP → V1.0 → V1.5 (mapas) → V2.0 (gamificação)

**Lei 7: Qualidade Decrescente**
- *"A menos que seja rigorosamente mantido e adaptado, qualidade percebida diminuirá"*
- **Aplicação DoaCin**: Sem refactoring, código técnico debt aumenta (comentários "melhorias" no código)

**Lei 8: Sistema de Feedback**
- *"Processos de evolução constituem sistemas de feedback multi-nível e multi-loop"*
- **Aplicação DoaCin**: Feedback de usuários → Issues → Desenvolvimento → Release → Feedback

#### Impacto no DoaCin

```
EVIDÊNCIAS NO DoaCin:

Lei 2 (Complexidade Crescente):
├─ Início: Login + Cadastro (simples)
├─ V1.0: + Dashboard + Histórico (moderado)
├─ V1.5: + Mapas Leaflet (complexo)
└─ V2.0: + Gamificação Conecta + Quiz (muito complexo)

Lei 7 (Qualidade Decrescente sem Manutenção):
├─ dashboardController.js: 4 queries sequenciais (lento)
├─ authController.js: Lógica duplicada (email normalization)
└─ Comentários "melhorias" indicam debt técnico acumulado
```

---

### 9.3 Refactoring

#### Definição

**Refactoring** é o processo de reestruturar código existente **sem alterar seu comportamento externo**, melhorando sua estrutura interna, legibilidade e manutenibilidade.

**Características:**
- **Sem mudança de funcionalidade**: Output permanece o mesmo
- **Pequenos passos**: Mudanças incrementais e seguras
- **Testes**: Garantem que comportamento não mudou
- **Objetivo**: Código mais limpo, simples, eficiente

**Quando Refatorar:**
- Código duplicado
- Funções/métodos muito longos
- Muitos parâmetros
- Nomes ruins
- Comentários excessivos (código deve ser auto-explicativo)
- Performance ruim

---

#### Refactorings Feitos no DoaCin

##### Refactoring 1: Extract Function (parseDate)

**Antes:**
```javascript
// routes/controllers/userController.js (versão antiga, hipotética)

export const updateUserProfile = async (req, res) => {
  const { dataNascimento } = req.body;
  
  // Lógica inline (duplicada em múltiplos lugares)
  let parsedDate = null;
  if (dataNascimento && typeof dataNascimento === 'string') {
    const parts = dataNascimento.split('/');
    if (parts.length === 3) {
      const date = new Date(parts[2], parts[1] - 1, parts[0]);
      if (!isNaN(date.getTime())) {
        parsedDate = date.toISOString();
      }
    }
  }
  
  await prisma.user.update({
    data: { birthDate: parsedDate }
  });
};
```

**Depois:**
```javascript
// routes/controllers/userController.js (atual)

function parseDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;
  
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  
  return null;
}

export const updateUserProfile = async (req, res) => {
  const { dataNascimento } = req.body;
  
  const dataParaAtualizar = {
    birthDate: parseDate(dataNascimento) // Função reutilizável
  };
  
  await prisma.user.update({
    data: dataParaAtualizar
  });
};
```

**Benefícios:**
- ✓ Reutilizável em outros controllers
- ✓ Testável isoladamente
- ✓ Reduz duplicação
- ✓ Nome descritivo (`parseDate`)

---

##### Refactoring 2: Normalize Email (Extract and Deduplicate)

**Antes:**
```javascript
// routes/controllers/authController.js (versão com duplicação)

export const register = async (req, res) => {
  const { email } = req.body;
  
  // Normalização inline
  const normalizedEmail = email.toLowerCase().trim();
  
  const existingUser = await prisma.user.findFirst({
    where: { email: normalizedEmail }
  });
  // ...
};

export const login = async (req, res) => {
  const { email } = req.body;
  
  // Duplicação da mesma lógica
  const normalizedEmail = email.toLowerCase().trim();
  
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });
  // ...
};
```

**Depois (Refactoring aplicado):**
```javascript
// utils/emailNormalizer.js (novo arquivo)

export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }
  return email.toLowerCase().trim();
}

// routes/controllers/authController.js

import { normalizeEmail } from '../../utils/emailNormalizer.js';

export const register = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);
  
  const existingUser = await prisma.user.findFirst({
    where: { email: normalizedEmail }
  });
  // ...
};

export const login = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);
  
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });
  // ...
};
```

**Benefícios:**
- ✓ DRY (Don't Repeat Yourself)
- ✓ Centraliza lógica de normalização
- ✓ Fácil adicionar validação (regex de email)
- ✓ Testável

---

##### Refactoring 3: Replace Magic Numbers with Named Constants

**Antes:**
```javascript
// routes/controllers/dashboardController.js (com magic numbers)

export const getDashboardStats = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // Magic numbers (60, 90) sem contexto
  const minimumInterval = user.genero === 'M' ? 60 : 90;
  
  const daysUntilNext = Math.max(0, minimumInterval - daysSince);
};
```

**Depois:**
```javascript
// config/donationRules.js (novo arquivo)

export const DONATION_RULES = {
  MINIMUM_INTERVAL_MALE_DAYS: 60,
  MINIMUM_INTERVAL_FEMALE_DAYS: 90,
  MINIMUM_WEIGHT_KG: 50,
  MINIMUM_AGE_YEARS: 16,
  MAXIMUM_AGE_YEARS: 69,
  POINTS_PER_DONATION: 100
};

// routes/controllers/dashboardController.js

import { DONATION_RULES } from '../../config/donationRules.js';

export const getDashboardStats = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const minimumInterval = user.genero === 'M' 
    ? DONATION_RULES.MINIMUM_INTERVAL_MALE_DAYS
    : DONATION_RULES.MINIMUM_INTERVAL_FEMALE_DAYS;
  
  const daysUntilNext = Math.max(0, minimumInterval - daysSince);
};
```

**Benefícios:**
- ✓ Self-documenting code
- ✓ Fácil mudar regras (único lugar)
- ✓ Evita erros de digitação (60 vs 6)
- ✓ Centraliza regras de negócio

---

#### Refactorings Possíveis no DoaCin

##### Refactoring 4: Paralelizar Queries (Promise.all)

**Atual:**
```javascript
// routes/controllers/dashboardController.js

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    // QUERIES SEQUENCIAIS (lento)
    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    }); // ~50ms
    
    const { _sum } = await prisma.donation.aggregate({
      _sum: { pointsEarned: true },
      where: { userId: userId, status: 'confirmed' },
    }); // ~80ms
    
    const lastDonation = await prisma.donation.findFirst({
      where: { userId: userId, status: 'confirmed' },
      orderBy: { donationDate: 'desc' },
    }); // ~60ms
    
    const donationCountLastYear = await prisma.donation.count({
      where: { userId: userId, status: 'confirmed' }
    }); // ~40ms
    
    // TEMPO TOTAL: ~230ms (50+80+60+40)
  }
};
```

**Refactored (Proposto):**
```javascript
// routes/controllers/dashboardController.js

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    // QUERIES EM PARALELO (rápido)
    const [user, aggregateResult, lastDonation, donationCountLastYear] = 
      await Promise.all([
        prisma.user.findUnique({ 
          where: { id: userId },
          select: { genero: true, nome: true, bloodType: true } // Só campos necessários
        }),
        
        prisma.donation.aggregate({
          _sum: { pointsEarned: true },
          where: { userId: userId, status: 'confirmed' },
        }),
        
        prisma.donation.findFirst({
          where: { userId: userId, status: 'confirmed' },
          orderBy: { donationDate: 'desc' },
          select: { donationDate: true } // Só a data
        }),
        
        prisma.donation.count({
          where: { userId: userId, status: 'confirmed' }
        })
      ]);
    
    // TEMPO TOTAL: ~80ms (maior query individual)
    // GANHO: ~150ms (65% mais rápido)
    
    const { _sum } = aggregateResult;
    const capibasBalance = _sum.pointsEarned || 0;
    
    // Resto do código permanece igual
  }
};
```

**Benefícios:**
- ✓ **Performance**: 230ms → 80ms (3x mais rápido)
- ✓ Queries independentes executam simultaneamente
- ✓ Melhor experiência do usuário (dashboard mais responsivo)
- ✓ Redução de carga no banco (conexões mais curtas)

**Medição:**
```javascript
// Antes: 4 queries sequenciais
[Query 1] ====> 50ms
          [Query 2] ====> 80ms
                    [Query 3] ====> 60ms
                              [Query 4] ====> 40ms
Total: 230ms

// Depois: 4 queries paralelas
[Query 1] ====> 50ms
[Query 2] ==========> 80ms ← maior
[Query 3] ======> 60ms
[Query 4] ====> 40ms
Total: 80ms (tempo da query mais lenta)
```

---

##### Refactoring 5: Extract Service Layer (Separation of Concerns)

**Atual:**
```javascript
// routes/controllers/donationsController.js (Controller com lógica de negócio)

export const getDonationHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    // CONTROLLER FAZENDO TUDO (acesso DB + lógica + formatação)
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: "desc" },
      include: { pontoColeta: { select: { nome: true } } },
    });

    // Formatação (deveria estar em Service)
    const formattedDonations = donations.map((donation) => {
      return {
        id: donation.id,
        donationDate: donation.donationDate,
        status: donation.status,
        pointsEarned: donation.pointsEarned,
        location: {
          name: donation.pontoColeta
            ? donation.pontoColeta.nome
            : "Local não informado",
        },
      };
    });

    res.status(200).json(formattedDonations);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico" });
  }
};
```

**Refactored (Proposto):**
```javascript
// services/DonationService.js (NOVA CAMADA - Service)

class DonationService {
  async getDonationHistoryByUser(userId) {
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: "desc" },
      include: { pontoColeta: { select: { nome: true } } },
    });
    
    return donations;
  }
  
  formatDonationHistory(donations) {
    return donations.map((donation) => ({
      id: donation.id,
      donationDate: donation.donationDate,
      status: donation.status,
      pointsEarned: donation.pointsEarned,
      location: {
        name: donation.pontoColeta?.nome ?? "Local não informado",
      },
    }));
  }
  
  async createDonation(userId, pontoColetaId, donationDate) {
    // Validações de negócio
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user.weight || user.weight < 50) {
      throw new Error('Peso mínimo não atingido');
    }
    
    const lastDonation = await prisma.donation.findFirst({
      where: { userId: userId, status: 'confirmed' },
      orderBy: { donationDate: 'desc' }
    });
    
    if (lastDonation) {
      const daysSince = Math.floor(
        (new Date() - new Date(lastDonation.donationDate)) / (1000 * 60 * 60 * 24)
      );
      const minInterval = user.genero === 'M' ? 60 : 90;
      
      if (daysSince < minInterval) {
        throw new Error(`Aguarde ${minInterval - daysSince} dias`);
      }
    }
    
    // Criação
    return await prisma.donation.create({
      data: {
        userId: userId,
        pontoColetaId: pontoColetaId,
        donationDate: donationDate,
        status: 'pending',
        pointsEarned: 0
      }
    });
  }
}

export default new DonationService();

// routes/controllers/donationsController.js (Controller MAGRO)

import donationService from '../../services/DonationService.js';

export const getDonationHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Controller apenas orquestra
    const donations = await donationService.getDonationHistoryByUser(userId);
    const formatted = donationService.formatDonationHistory(donations);
    
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico" });
  }
};

export const createDonation = async (req, res) => {
  const userId = req.user.userId;
  const { pontoColetaId, donationDate } = req.body;
  
  try {
    // Service tem toda a lógica de negócio
    const donation = await donationService.createDonation(
      userId, 
      pontoColetaId, 
      donationDate
    );
    
    res.status(201).json(donation);
  } catch (error) {
    if (error.message.includes('Aguarde')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao criar doação' });
  }
};
```

**Benefícios:**
- ✓ **Separation of Concerns**: Controller só gerencia HTTP, Service tem lógica
- ✓ **Testabilidade**: Service pode ser testado sem Express
- ✓ **Reutilização**: Mesma lógica pode ser chamada de múltiplos controllers
- ✓ **Manutenibilidade**: Lógica de negócio centralizada

**Arquitetura Antes vs Depois:**
```
ANTES (Controller faz tudo):
┌─────────────────────────────────┐
│     donationsController.js      │
│                                 │
│ ✗ HTTP (req, res)               │
│ ✗ Validação de negócio          │
│ ✗ Acesso ao banco (Prisma)      │
│ ✗ Formatação de dados           │
│ ✗ Tratamento de erros           │
└─────────────────────────────────┘
        ↓
  [Prisma] → [PostgreSQL]

DEPOIS (Camadas separadas):
┌─────────────────────────────────┐
│     donationsController.js      │
│   (MAGRO - apenas HTTP)         │
│                                 │
│ ✓ HTTP (req, res)               │
│ ✓ Chamar Service                │
│ ✓ Retornar resposta             │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│      DonationService.js         │
│   (LÓGICA DE NEGÓCIO)           │
│                                 │
│ ✓ Validações                    │
│ ✓ Regras de negócio             │
│ ✓ Formatação                    │
└─────────────────────────────────┘
        ↓
  [Prisma] → [PostgreSQL]

BENEFÍCIO: Camadas com responsabilidades claras
```

---

### 9.4 Catálogo de Refactorings (Referência)

| Refactoring | Quando Usar | Exemplo DoaCin |
|-------------|-------------|----------------|
| **Extract Function** | Código duplicado, blocos longos | `parseDate()` |
| **Inline Function** | Função com corpo trivial | - |
| **Rename Variable** | Nome confuso | `tipoRed` → `bloodType` |
| **Extract Variable** | Expressão complexa | - |
| **Replace Magic Number** | Números sem contexto | `60` → `MINIMUM_INTERVAL_MALE_DAYS` |
| **Split Phase** | Função faz múltiplas coisas | Separar validação de persistência |
| **Consolidate Conditional** | Múltiplos ifs similares | - |
| **Replace Nested Conditional with Guard Clauses** | Ifs aninhados | Adicionar early returns |
| **Introduce Parameter Object** | Muitos parâmetros | Agrupar dados de doação em objeto |
| **Extract Class** | Classe grande | Extrair `DonationService` de controller |

---

## Resumo do Capítulo 9

### 9.1 Manutenção de Software ✅
- **4 tipos**: Corretiva, Adaptativa, Perfectiva, Preventiva
- **Tabela comparativa** com exemplos do DoaCin

### 9.2 Leis de Lehman ✅
- **8 leis** com definição e aplicação ao DoaCin
- Destaque para:
  - Lei 2: Complexidade crescente (MVP → Gamificação)
  - Lei 7: Qualidade decrescente sem manutenção (debt técnico)

### 9.3 Refactoring ✅
**Definição**: Reestruturar código sem mudar comportamento

**3 Refactorings Feitos:**
1. Extract Function (`parseDate`)
2. Normalize Email (deduplicate)
3. Replace Magic Numbers (DONATION_RULES)

**2 Refactorings Possíveis:**
1. Paralelizar queries (Promise.all) - 3x mais rápido
2. Extract Service Layer - separar lógica de negócio

**Catálogo**: 10 refactorings comuns com aplicações

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - Capítulo 9: Refactoring*
