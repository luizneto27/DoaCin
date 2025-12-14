# Respostas - DevOps aplicado ao DoaCin

## DevOps

### Conceitos Fundamentais

#### DevOps - Definição e Objetivos

**Definição:**
DevOps é uma cultura e conjunto de práticas que integra desenvolvimento (Dev) e operações (Ops), visando entregar software de forma mais rápida, confiável e frequente.

**Objetivos:**
1. **Automação**: Reduzir tarefas manuais repetitivas
2. **Integração Contínua**: Integrar código frequentemente
3. **Entrega Contínua**: Deploy rápido e seguro
4. **Monitoramento**: Feedback rápido de produção
5. **Colaboração**: Quebrar silos entre times

---

#### DVCS (Distributed Version Control System)

**Definição:**
Sistema de controle de versão distribuído onde cada desenvolvedor possui uma cópia completa do repositório, incluindo todo o histórico.

**Exemplos:** Git, Mercurial

**Características:**
- Cada clone é um backup completo
- Trabalho offline possível
- Branches leves e rápidos
- Merge descentralizado

**DoaCin usa:** Git + GitHub

---

#### Monorepos vs Multirepos

| Aspecto | Monorepo | Multirepo |
|---------|----------|-----------|
| **Estrutura** | Todos os projetos em 1 repositório | 1 projeto por repositório |
| **Compartilhamento** | Fácil (mesmo repo) | Difícil (precisa publicar pacotes) |
| **Versionamento** | Único para tudo | Independente por projeto |
| **CI/CD** | Complexo (build seletivo) | Simples (build isolado) |
| **Exemplo** | Google, Facebook | Microsserviços |
| **DoaCin** | ✓ Monorepo (frontend + backend) | |

**Vantagens Monorepo (DoaCin):**
- Código compartilhado facilmente
- Refactoring atômico (muda frontend e backend juntos)
- Único PR para mudanças full-stack

**Desvantagens:**
- Repositório grande com o tempo
- CI precisa detectar o que mudou

---

#### Integração Contínua (CI)

**Definição:**
Prática de integrar código frequentemente (várias vezes ao dia) ao branch principal, executando builds e testes automaticamente.

**Fluxo:**
```
Desenvolvedor → Commit → Push → CI Server → Build → Testes → ✓/✗
```

**Benefícios:**
- Detecta bugs cedo
- Reduz conflitos de merge
- Código sempre compilável

**Ferramentas:** GitHub Actions, Jenkins, CircleCI, GitLab CI

**DoaCin:** Não implementado (possível com GitHub Actions)

---

#### Deploy Contínuo (CD)

**Definição:**
Automação do processo de deploy para produção. Cada commit que passa nos testes é automaticamente deployado.

**Variações:**
- **Continuous Delivery**: Deploy manual após aprovação
- **Continuous Deployment**: Deploy automático total

**Pipeline:**
```
Commit → CI (build + testes) → CD (deploy staging) → [Aprovação] → Deploy produção
```

**Ferramentas:** GitHub Actions, Vercel, Heroku, AWS CodePipeline

**DoaCin:** Não implementado (deploy manual)

---

### Feature Flags - Problema

#### Definição

Feature flags (feature toggles) permitem ativar/desativar funcionalidades via configuração, sem deploy de código.

```javascript
// Exemplo
if (featureFlags.gamification) {
  // Código da gamificação
}
```

#### Problema Principal: Debt Técnico

**Cenário:**
Código com feature flags acumula-se, criando complexidade:

```javascript
// DoaCin - Exemplo hipotético

export const createDonation = async (req, res) => {
  const donation = await prisma.donation.create({ data: req.body });
  
  // Feature flag 1
  if (featureFlags.gamification) {
    await registrarGamificacao(donation);
  }
  
  // Feature flag 2
  if (featureFlags.notifications) {
    await sendNotification(donation);
  }
  
  // Feature flag 3
  if (featureFlags.analytics) {
    await trackEvent('donation_created', donation);
  }
  
  // Feature flag 4 (nested)
  if (featureFlags.rewards) {
    if (featureFlags.rewardsV2) {
      await calculateRewardsV2(donation);
    } else {
      await calculateRewards(donation);
    }
  }
  
  res.json(donation);
};
```

**Problemas:**

1. **Complexidade Crescente**
   - Código cheio de `if` statements
   - Difícil entender fluxo real

2. **Combinações Exponenciais**
   - 4 flags = 16 combinações possíveis (2^4)
   - Impossível testar todas

3. **Debt Técnico**
   - Flags antigas não removidas
   - Código morto acumula

4. **Performance**
   - Verificações de flags em runtime
   - Overhead em cada execução

5. **Manutenção**
   - Difícil saber quais flags estão ativas
   - Risco de remover flag em uso

**Solução:**
- **Limpar flags antigas** após feature estabilizar
- **Documentar** quando cada flag será removida
- **Monitorar** uso de flags em produção

---

### Aplicação no DoaCin

#### 1. DevOps

**Status:** ❌ Não implementado

**Deveria ter:**
- Pipeline CI/CD automatizado
- Testes automáticos em PRs
- Deploy automatizado para staging/produção
- Monitoramento de erros (Sentry)

**Exemplo:**
```yaml
# .github/workflows/ci.yml (proposto)
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run lint
      - run: npm run test
```

---

#### 2. DVCS (Git)

**Status:** ✅ Implementado

**Evidências:**
- Repositório GitHub: `github.com/luizneto27/DoaCin`
- `.gitignore` presente
- Controle de versão ativo

**Uso:**
```bash
# Branches para features
git checkout -b feature/gamificacao
git add .
git commit -m "feat: adiciona integração Conecta"
git push origin feature/gamificacao
# Pull Request → Merge
```

---

#### 3. Monorepo

**Status:** ✅ Implementado

**Estrutura:**
```
DoaCin/
├── src/              ← Frontend (React)
│   ├── pages/
│   ├── components/
│   └── services/
├── routes/           ← Backend (Express)
│   └── controllers/
├── prisma/           ← Database schema
├── package.json      ← Dependências unificadas
└── server.js         ← Backend entry point
```

**Vantagens no DoaCin:**
- API types compartilhados (possível)
- Refactoring cross-stack em único commit
- Um `npm install` para tudo

---

#### 4. Integração Contínua

**Status:** ❌ Não implementado

**Proposta:**
```yaml
# .github/workflows/ci.yml
name: DoaCin CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: admin
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run Prisma migrations
      run: npx prisma migrate deploy
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test
    
    - name: Build frontend
      run: npm run build
```

**Benefícios:**
- Detecta erros antes do merge
- Garante que build funciona
- Testes rodam automaticamente

---

#### 5. Deploy Contínuo

**Status:** ❌ Não implementado

**Proposta para Produção:**

**Opção 1: Vercel (Frontend) + Railway (Backend)**
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "src": "/api/(.*)", "dest": "https://doacin-api.railway.app/$1" }
  ]
}
```

**Opção 2: Render (Full-stack)**
```yaml
# render.yaml
services:
  - type: web
    name: doacin
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run server
    envVars:
      - key: DATABASE_URL
        sync: false
```

**Pipeline ideal:**
```
Push to main → GitHub Actions (CI) → ✓ Tests → Deploy to Staging → Manual Approval → Deploy to Production
```

---

#### 6. Feature Flags

**Status:** ❌ Não implementado

**Uso Potencial no DoaCin:**

```javascript
// config/featureFlags.js (proposto)
export const FEATURES = {
  GAMIFICATION: process.env.FEATURE_GAMIFICATION === 'true',
  QUIZ: process.env.FEATURE_QUIZ === 'true',
  NOTIFICATIONS: process.env.FEATURE_NOTIFICATIONS === 'true',
};

// Uso em controller
import { FEATURES } from '../config/featureFlags.js';

export const createDonation = async (req, res) => {
  const donation = await prisma.donation.create({ data });
  
  if (FEATURES.GAMIFICATION) {
    await registrarGamificacao(donation);
  }
  
  res.json(donation);
};

// Frontend
import { FEATURES } from './config/featureFlags';

function HomePage() {
  return (
    <>
      <Dashboard />
      {FEATURES.QUIZ && <QuizLink />}
    </>
  );
}
```

**Quando seria útil:**
- Testar gamificação com 10% dos usuários
- Desligar quiz se houver bugs
- Lançamento gradual de features

---

### Resumo DevOps no DoaCin

| Conceito | Status | Detalhes |
|----------|--------|----------|
| **DevOps** | ❌ Não aplicado | Sem automação de deploy |
| **DVCS** | ✅ Implementado | Git + GitHub |
| **Monorepo** | ✅ Implementado | Frontend + Backend no mesmo repo |
| **CI** | ❌ Não implementado | Possível com GitHub Actions |
| **CD** | ❌ Não implementado | Deploy manual (local) |
| **Feature Flags** | ❌ Não implementado | Não há toggles de features |

**Recomendações:**
1. Implementar GitHub Actions para CI
2. Configurar deploy automático (Vercel/Railway)
3. Adicionar testes antes do CI
4. Considerar feature flags para experimentos

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - DevOps*
