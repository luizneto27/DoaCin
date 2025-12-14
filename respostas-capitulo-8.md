# Respostas - Capítulo 8: Testes aplicados ao DoaCin

## Capítulo 8: Testes

### 8.1 Tipos de Testes

#### Testes de Unidade (Unit Tests)

**Definição:**
Testes que verificam o funcionamento de **unidades isoladas** de código (funções, métodos, classes) independentemente de dependências externas.

**Características:**
- **Escopo**: Menor possível (uma função/método)
- **Velocidade**: Muito rápidos (milissegundos)
- **Isolamento**: Usa mocks/stubs para dependências
- **Quantidade**: Centenas ou milhares no projeto
- **Objetivo**: Validar lógica de negócio em nível de código

#### Testes de Integração (Integration Tests)

**Definição:**
Testes que verificam a **interação entre módulos** ou componentes, incluindo acesso a banco de dados, APIs externas e serviços.

**Características:**
- **Escopo**: Múltiplos módulos trabalhando juntos
- **Velocidade**: Moderados (centenas de ms a segundos)
- **Isolamento**: Parcial (usa banco de testes, APIs mock)
- **Quantidade**: Dezenas a centenas
- **Objetivo**: Validar comunicação entre componentes

#### Testes de Sistema (System Tests / E2E)

**Definição:**
Testes que verificam o **sistema completo** do ponto de vista do usuário final, simulando fluxos reais de uso.

**Características:**
- **Escopo**: Sistema inteiro (frontend + backend + banco)
- **Velocidade**: Lentos (segundos a minutos)
- **Isolamento**: Nenhum (ambiente completo)
- **Quantidade**: Poucos (fluxos críticos)
- **Objetivo**: Validar funcionalidades end-to-end

#### Comparação

| Aspecto | Unidade | Integração | Sistema |
|---------|---------|------------|---------|
| **O que testa** | 1 função | Vários módulos | Sistema completo |
| **Velocidade** | <10ms | 100-1000ms | 5-30s |
| **Custo de manutenção** | Baixo | Médio | Alto |
| **Confiabilidade** | Média | Alta | Muito alta |
| **Quantidade ideal** | 70% | 20% | 10% |
| **Exemplo** | `validateCPF()` | `POST /api/auth/register` | Login → Doar → Ver histórico |

**Pirâmide de Testes:**
```
           /\
          /  \     ← Testes de Sistema (poucos, lentos, caros)
         /    \
        /──────\
       /        \   ← Testes de Integração (moderados)
      /          \
     /────────────\
    /              \ ← Testes de Unidade (muitos, rápidos, baratos)
   /________________\
```

---

### 8.2 Exemplos de Testes no DoaCin

**Observação:** O DoaCin atualmente não possui testes implementados. Os exemplos abaixo demonstram como cada tipo de teste seria implementado.

---

#### Testes de Unidade no DoaCin

**Framework sugerido:** Jest + Babel (para suporte a ES6 modules)

##### Exemplo 1: Validação de CPF

```javascript
// utils/validators.js (função a ser criada)

export function validateCPF(cpf) {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}
```

```javascript
// __tests__/unit/validators.test.js

import { validateCPF } from '../../utils/validators';

describe('validateCPF', () => {
  test('deve aceitar CPF válido sem formatação', () => {
    expect(validateCPF('12345678909')).toBe(true);
  });
  
  test('deve aceitar CPF válido com formatação', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });
  
  test('deve rejeitar CPF com menos de 11 dígitos', () => {
    expect(validateCPF('123456789')).toBe(false);
  });
  
  test('deve rejeitar CPF com todos os dígitos iguais', () => {
    expect(validateCPF('11111111111')).toBe(false);
    expect(validateCPF('00000000000')).toBe(false);
  });
  
  test('deve rejeitar CPF com dígito verificador inválido', () => {
    expect(validateCPF('12345678900')).toBe(false);
  });
});

// CARACTERÍSTICAS DO TESTE DE UNIDADE:
// ✓ Testa APENAS uma função (validateCPF)
// ✓ Não acessa banco de dados
// ✓ Não faz requisições HTTP
// ✓ Execução rápida (<5ms por teste)
// ✓ Fácil de manter
```

##### Exemplo 2: Cálculo de Intervalo de Doação

```javascript
// utils/donationInterval.js (extrair lógica do dashboardController)

export function calculateDonationInterval(gender, lastDonationDate) {
  if (!lastDonationDate) {
    return {
      canDonate: true,
      daysUntilNext: 0,
      minimumInterval: gender === 'M' ? 60 : 90
    };
  }
  
  const minimumInterval = gender === 'M' ? 60 : 90;
  const daysSinceLastDonation = Math.floor(
    (new Date() - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24)
  );
  
  const daysUntilNext = Math.max(0, minimumInterval - daysSinceLastDonation);
  const canDonate = daysSinceLastDonation >= minimumInterval;
  
  return { canDonate, daysUntilNext, minimumInterval };
}
```

```javascript
// __tests__/unit/donationInterval.test.js

import { calculateDonationInterval } from '../../utils/donationInterval';

describe('calculateDonationInterval', () => {
  // Mock da data atual para testes consistentes
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-01'));
  });
  
  afterAll(() => {
    jest.useRealTimers();
  });
  
  test('homem pode doar após 60 dias', () => {
    const lastDonation = new Date('2025-04-02'); // 60 dias atrás
    const result = calculateDonationInterval('M', lastDonation);
    
    expect(result.canDonate).toBe(true);
    expect(result.daysUntilNext).toBe(0);
    expect(result.minimumInterval).toBe(60);
  });
  
  test('homem NÃO pode doar antes de 60 dias', () => {
    const lastDonation = new Date('2025-05-01'); // 31 dias atrás
    const result = calculateDonationInterval('M', lastDonation);
    
    expect(result.canDonate).toBe(false);
    expect(result.daysUntilNext).toBe(29); // 60 - 31
    expect(result.minimumInterval).toBe(60);
  });
  
  test('mulher pode doar após 90 dias', () => {
    const lastDonation = new Date('2025-03-03'); // 90 dias atrás
    const result = calculateDonationInterval('F', lastDonation);
    
    expect(result.canDonate).toBe(true);
    expect(result.daysUntilNext).toBe(0);
    expect(result.minimumInterval).toBe(90);
  });
  
  test('mulher NÃO pode doar antes de 90 dias', () => {
    const lastDonation = new Date('2025-04-01'); // 61 dias atrás
    const result = calculateDonationInterval('F', lastDonation);
    
    expect(result.canDonate).toBe(false);
    expect(result.daysUntilNext).toBe(29); // 90 - 61
  });
  
  test('primeiro doador pode doar imediatamente', () => {
    const result = calculateDonationInterval('M', null);
    
    expect(result.canDonate).toBe(true);
    expect(result.daysUntilNext).toBe(0);
  });
});

// TESTE DE UNIDADE - CARACTERÍSTICAS:
// ✓ Função pura (sem side effects)
// ✓ Mock de tempo (jest.useFakeTimers)
// ✓ Testa lógica de negócio isoladamente
// ✓ Não depende de banco/API
```

##### Exemplo 3: Hash de Senha

```javascript
// __tests__/unit/authController.test.js

import bcrypt from 'bcryptjs';
import { register } from '../../routes/controllers/authController';
import prisma from '../../config/database';

// Mock do Prisma
jest.mock('../../config/database', () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  }
}));

describe('authController - register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('deve criptografar senha com bcrypt', async () => {
    // Arrange
    const req = {
      body: {
        nome: 'João Silva',
        email: 'joao@test.com',
        password: 'senha123',
        cpf: '12345678909'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    prisma.user.findFirst.mockResolvedValue(null); // Não existe
    prisma.user.create.mockResolvedValue({ id: '1', email: 'joao@test.com' });
    
    // Act
    await register(req, res);
    
    // Assert
    const createCall = prisma.user.create.mock.calls[0][0];
    const hashedPassword = createCall.data.password;
    
    // Verifica que senha foi hashada
    expect(hashedPassword).not.toBe('senha123');
    expect(hashedPassword.length).toBeGreaterThan(50);
    
    // Verifica que bcrypt pode validar o hash
    const isValid = await bcrypt.compare('senha123', hashedPassword);
    expect(isValid).toBe(true);
  });
  
  test('deve rejeitar usuário duplicado', async () => {
    const req = {
      body: { nome: 'João', email: 'joao@test.com', password: '123', cpf: '111' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    prisma.user.findFirst.mockResolvedValue({ id: '1' }); // Já existe
    
    await register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Email ou CPF já cadastrado.' 
    });
  });
});

// CARACTERÍSTICAS:
// ✓ Mock do Prisma (não acessa banco real)
// ✓ Testa lógica do controller isoladamente
// ✓ Verifica comportamento esperado
```

---

#### Testes de Integração no DoaCin

**Framework sugerido:** Jest + Supertest (para testar rotas HTTP)

##### Exemplo 1: Registro de Usuário (API + Banco)

```javascript
// __tests__/integration/auth.integration.test.js

import request from 'supertest';
import app from '../../server'; // Express app
import prisma from '../../config/database';

describe('POST /api/auth/register - Integração', () => {
  // Limpar banco antes de cada teste
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });
  
  // Fechar conexão após todos os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  test('deve registrar usuário com sucesso e persistir no banco', async () => {
    // Arrange
    const userData = {
      nome: 'Maria Santos',
      email: 'maria@test.com',
      password: 'senha@Forte123',
      cpf: '12345678909'
    };
    
    // Act - Envia requisição HTTP real
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    // Assert - Verifica resposta
    expect(response.body.message).toBe('Usuário registrado com sucesso!');
    
    // Assert - Verifica que foi salvo no banco
    const userInDb = await prisma.user.findUnique({
      where: { email: 'maria@test.com' }
    });
    
    expect(userInDb).toBeDefined();
    expect(userInDb.nome).toBe('Maria Santos');
    expect(userInDb.cpf).toBe('12345678909');
    
    // Assert - Verifica que senha foi hashada
    expect(userInDb.password).not.toBe('senha@Forte123');
    expect(userInDb.password.length).toBeGreaterThan(50);
  });
  
  test('deve impedir registro de email duplicado', async () => {
    // Arrange - Criar usuário primeiro
    await prisma.user.create({
      data: {
        nome: 'João',
        email: 'joao@test.com',
        cpf: '11111111111',
        password: 'hash123'
      }
    });
    
    // Act - Tentar registrar com mesmo email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Pedro',
        email: 'joao@test.com', // Email duplicado
        cpf: '22222222222',
        password: 'senha123'
      })
      .expect(400);
    
    // Assert
    expect(response.body.message).toBe('Email ou CPF já cadastrado.');
    
    // Verifica que só há 1 usuário no banco
    const count = await prisma.user.count();
    expect(count).toBe(1);
  });
});

// CARACTERÍSTICAS DO TESTE DE INTEGRAÇÃO:
// ✓ Testa Controller + Prisma + PostgreSQL
// ✓ Usa banco de dados real (teste ou docker)
// ✓ Requisições HTTP reais (via supertest)
// ✓ Verifica persistência dos dados
// ✓ Mais lento que unidade (~500ms)
```

##### Exemplo 2: Login e Autenticação

```javascript
// __tests__/integration/auth.login.test.js

import request from 'supertest';
import app from '../../server';
import prisma from '../../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('POST /api/auth/login - Integração', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  test('deve fazer login com credenciais válidas', async () => {
    // Arrange - Criar usuário no banco
    const hashedPassword = await bcrypt.hash('senha123', 12);
    await prisma.user.create({
      data: {
        nome: 'Ana Costa',
        email: 'ana@test.com',
        cpf: '98765432100',
        password: hashedPassword
      }
    });
    
    // Act - Login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ana@test.com',
        password: 'senha123'
      })
      .expect(200);
    
    // Assert - Verifica resposta
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('userId');
    
    // Assert - Valida JWT
    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.email).toBe('ana@test.com');
    expect(decoded).toHaveProperty('userId');
  });
  
  test('deve rejeitar senha incorreta', async () => {
    // Arrange
    const hashedPassword = await bcrypt.hash('senha_correta', 12);
    await prisma.user.create({
      data: {
        nome: 'Carlos',
        email: 'carlos@test.com',
        cpf: '11111111111',
        password: hashedPassword
      }
    });
    
    // Act - Login com senha errada
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'carlos@test.com',
        password: 'senha_errada'
      })
      .expect(401);
    
    // Assert
    expect(response.body.message).toBe('Email ou senha inválidos.');
  });
  
  test('deve rejeitar email inexistente', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'naoexiste@test.com',
        password: 'qualquer'
      })
      .expect(401);
    
    expect(response.body.message).toBe('Email ou senha inválidos.');
  });
});

// INTEGRAÇÃO:
// ✓ Testa rota HTTP completa
// ✓ Verifica bcrypt.compare()
// ✓ Valida geração de JWT
// ✓ Consulta banco de dados
```

##### Exemplo 3: Criar Doação (Requer Autenticação)

```javascript
// __tests__/integration/donations.integration.test.js

import request from 'supertest';
import app from '../../server';
import prisma from '../../config/database';
import jwt from 'jsonwebtoken';

describe('POST /api/donations - Integração', () => {
  let authToken;
  let userId;
  let pontoColetaId;
  
  beforeEach(async () => {
    // Limpar banco
    await prisma.donation.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.pontoColeta.deleteMany({});
    
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome: 'Pedro Doador',
        email: 'pedro@test.com',
        cpf: '12312312312',
        password: 'hash',
        genero: 'M',
        weight: 75.0
      }
    });
    userId = user.id;
    
    // Criar token JWT
    authToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Criar ponto de coleta
    const ponto = await prisma.pontoColeta.create({
      data: {
        nome: 'Hemocentro Central',
        latitude: -23.5505,
        longitude: -46.6333,
        endereco: 'Rua Teste, 123'
      }
    });
    pontoColetaId = ponto.id;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  test('deve criar doação com autenticação válida', async () => {
    // Act
    const response = await request(app)
      .post('/api/donations')
      .set('Authorization', `Bearer ${authToken}`) // Middleware auth
      .send({
        pontoColetaId: pontoColetaId,
        donationDate: new Date().toISOString()
      })
      .expect(201);
    
    // Assert
    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(userId);
    expect(response.body.status).toBe('pending');
    
    // Verifica no banco
    const donationInDb = await prisma.donation.findFirst({
      where: { userId: userId }
    });
    
    expect(donationInDb).toBeDefined();
    expect(donationInDb.pontoColetaId).toBe(pontoColetaId);
  });
  
  test('deve rejeitar doação sem token JWT', async () => {
    const response = await request(app)
      .post('/api/donations')
      .send({
        pontoColetaId: pontoColetaId,
        donationDate: new Date().toISOString()
      })
      .expect(401);
    
    expect(response.body.message).toBe('Token não fornecido');
  });
  
  test('deve rejeitar token JWT inválido', async () => {
    const response = await request(app)
      .post('/api/donations')
      .set('Authorization', 'Bearer token_invalido')
      .send({
        pontoColetaId: pontoColetaId,
        donationDate: new Date().toISOString()
      })
      .expect(401);
    
    expect(response.body.message).toBe('Token inválido');
  });
});

// CARACTERÍSTICAS:
// ✓ Testa middleware de autenticação
// ✓ Testa controller + model
// ✓ Verifica relacionamentos (User + PontoColeta + Donation)
// ✓ Setup complexo (usuário + token + ponto coleta)
```

---

#### Testes de Sistema (End-to-End) no DoaCin

**Framework sugerido:** Cypress ou Playwright

##### Exemplo 1: Fluxo Completo de Doação

```javascript
// cypress/e2e/donation-flow.cy.js

describe('Fluxo Completo de Doação', () => {
  beforeEach(() => {
    // Limpar banco via API
    cy.task('db:reset');
    
    // Criar usuário de teste
    cy.task('db:seed', {
      user: {
        email: 'teste@doacin.com',
        password: 'Senha@123',
        nome: 'Usuário Teste',
        cpf: '12345678909',
        genero: 'M',
        weight: 80.0
      }
    });
  });
  
  test('deve permitir usuário fazer login, agendar doação e visualizar no histórico', () => {
    // 1. ACESSAR PÁGINA DE LOGIN
    cy.visit('http://localhost:5173/login');
    cy.url().should('include', '/login');
    
    // 2. FAZER LOGIN
    cy.get('input[name="email"]').type('teste@doacin.com');
    cy.get('input[name="password"]').type('Senha@123');
    cy.get('button[type="submit"]').click();
    
    // 3. VERIFICAR REDIRECIONAMENTO PARA DASHBOARD
    cy.url().should('eq', 'http://localhost:5173/');
    cy.contains('Bem-vindo, Usuário Teste').should('be.visible');
    
    // 4. NAVEGAR PARA PÁGINA DE DOAÇÕES
    cy.get('a[href="/doacoes"]').click();
    cy.url().should('include', '/doacoes');
    
    // 5. SELECIONAR PONTO DE COLETA NO MAPA
    cy.get('.leaflet-marker-icon').first().click();
    cy.contains('Hemocentro Central').should('be.visible');
    
    // 6. CLICAR EM "AGENDAR DOAÇÃO"
    cy.contains('button', 'Agendar Doação').click();
    
    // 7. PREENCHER FORMULÁRIO DE AGENDAMENTO
    cy.get('input[name="donationDate"]').type('2025-12-20');
    cy.get('button[type="submit"]').contains('Confirmar').click();
    
    // 8. VERIFICAR MENSAGEM DE SUCESSO
    cy.contains('Doação agendada com sucesso!').should('be.visible');
    
    // 9. VERIFICAR NO HISTÓRICO
    cy.get('.donation-history').should('contain', 'Hemocentro Central');
    cy.get('.donation-status').should('contain', 'Pendente');
    
    // 10. VERIFICAR NO BANCO DE DADOS
    cy.task('db:query', 'SELECT * FROM "Donation" WHERE "userId" = $1')
      .then((donations) => {
        expect(donations).to.have.length(1);
        expect(donations[0].status).to.equal('pending');
      });
  });
});

// CARACTERÍSTICAS DO TESTE DE SISTEMA:
// ✓ Testa sistema COMPLETO (frontend + backend + banco)
// ✓ Simula interação real do usuário
// ✓ Verifica UI (botões, textos, navegação)
// ✓ Valida fluxo end-to-end
// ✓ Lento (~10-30s por teste)
// ✓ Frágil (quebra com mudanças de UI)
```

##### Exemplo 2: Fluxo de Cadastro e Primeiro Acesso

```javascript
// cypress/e2e/register-and-first-access.cy.js

describe('Cadastro e Primeiro Acesso', () => {
  beforeEach(() => {
    cy.task('db:reset');
  });
  
  test('novo usuário deve conseguir se cadastrar e acessar o sistema', () => {
    // 1. ACESSAR PÁGINA DE CADASTRO
    cy.visit('http://localhost:5173/login');
    cy.contains('Criar conta').click();
    cy.url().should('include', '/register');
    
    // 2. PREENCHER FORMULÁRIO DE CADASTRO
    cy.get('input[name="nome"]').type('João da Silva');
    cy.get('input[name="email"]').type('joao@newemail.com');
    cy.get('input[name="cpf"]').type('12345678909');
    cy.get('input[name="password"]').type('Senha@Forte123');
    cy.get('input[name="confirmPassword"]').type('Senha@Forte123');
    
    // 3. SUBMETER FORMULÁRIO
    cy.get('button[type="submit"]').contains('Cadastrar').click();
    
    // 4. VERIFICAR REDIRECIONAMENTO PARA LOGIN
    cy.url().should('include', '/login');
    cy.contains('Cadastro realizado com sucesso!').should('be.visible');
    
    // 5. FAZER LOGIN COM NOVO USUÁRIO
    cy.get('input[name="email"]').type('joao@newemail.com');
    cy.get('input[name="password"]').type('Senha@Forte123');
    cy.get('button[type="submit"]').click();
    
    // 6. VERIFICAR DASHBOARD DE PRIMEIRO ACESSO
    cy.url().should('eq', 'http://localhost:5173/');
    cy.contains('Você ainda não fez nenhuma doação').should('be.visible');
    cy.get('.stat-card').contains('0 doações').should('be.visible');
    
    // 7. NAVEGAR PELO MENU
    cy.get('a[href="/campanhas"]').click();
    cy.url().should('include', '/campanhas');
    
    cy.get('a[href="/regras"]').click();
    cy.url().should('include', '/regras');
    cy.contains('Quem pode doar sangue?').should('be.visible');
  });
  
  test('deve impedir cadastro com email duplicado', () => {
    // Criar usuário primeiro
    cy.task('db:seed', {
      user: { email: 'existente@test.com', cpf: '11111111111' }
    });
    
    // Tentar cadastrar com mesmo email
    cy.visit('http://localhost:5173/register');
    cy.get('input[name="email"]').type('existente@test.com');
    cy.get('input[name="cpf"]').type('22222222222');
    cy.get('input[name="password"]').type('Senha@123');
    cy.get('button[type="submit"]').click();
    
    // Verificar mensagem de erro
    cy.contains('Email ou CPF já cadastrado').should('be.visible');
    cy.url().should('include', '/register'); // Não redireciona
  });
});
```

##### Exemplo 3: Responsividade e Experiência Mobile

```javascript
// cypress/e2e/mobile-experience.cy.js

describe('Experiência Mobile', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.task('db:seed', { user: { email: 'mobile@test.com' } });
    
    // Configurar viewport mobile
    cy.viewport('iphone-x');
  });
  
  test('deve funcionar corretamente em dispositivo móvel', () => {
    // Login
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type('mobile@test.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    
    // Verificar menu hamburguer
    cy.get('.menu-toggle').should('be.visible').click();
    cy.get('.sidebar-mobile').should('be.visible');
    
    // Navegar para mapa
    cy.contains('Locais de Doação').click();
    
    // Verificar que mapa é responsivo
    cy.get('.leaflet-container').should('be.visible');
    cy.get('.leaflet-container').should('have.css', 'width', '375px'); // iPhone X
    
    // Testar zoom no mapa (touch)
    cy.get('.leaflet-container').trigger('touchstart');
    cy.get('.leaflet-control-zoom-in').click();
    
    // Verificar card de local em mobile
    cy.get('.local-card').first().click();
    cy.get('.local-details').should('be.visible');
  });
});

// TESTE DE SISTEMA - CARACTERÍSTICAS:
// ✓ Testa UX completa
// ✓ Valida responsividade
// ✓ Simula dispositivos diferentes
// ✓ Testa toda a stack
```

---

### 8.3 Testes de Caixa-Branca e Caixa-Preta

#### Testes de Caixa-Branca (White-Box Testing)

**Definição:**
Testes onde o testador **conhece a implementação interna** do código. Focam em **cobertura de código**, caminhos de execução e lógica interna.

**Também conhecido como:**
- Glass-box testing
- Structural testing
- Clear-box testing

**Características:**
- **Acesso ao código**: Testador vê a implementação
- **Objetivo**: Cobrir todos os caminhos de execução
- **Técnicas**: Cobertura de linha, branch, path
- **Nível**: Normalmente testes de unidade
- **Quem faz**: Desenvolvedores

**Critérios de Cobertura:**
```
1. Cobertura de Linhas (Line Coverage)
   → Todas as linhas foram executadas?

2. Cobertura de Branches (Branch Coverage)
   → Todos os if/else foram testados?

3. Cobertura de Caminhos (Path Coverage)
   → Todas as combinações de caminhos?

4. Cobertura de Condições (Condition Coverage)
   → Todas as expressões booleanas?
```

#### Testes de Caixa-Preta (Black-Box Testing)

**Definição:**
Testes onde o testador **NÃO conhece a implementação interna**. Focam em **requisitos funcionais**, entradas e saídas esperadas.

**Características:**
- **Acesso ao código**: Testador não vê implementação
- **Objetivo**: Validar requisitos e especificações
- **Técnicas**: Particionamento de equivalência, análise de valor limite
- **Nível**: Todos os níveis (unidade, integração, sistema)
- **Quem faz**: Testadores, QA, usuários finais

**Técnicas:**
```
1. Particionamento de Equivalência
   → Agrupar entradas em classes equivalentes

2. Análise de Valor Limite (Boundary Value)
   → Testar limites de intervalos válidos

3. Tabela de Decisão
   → Combinar condições e ações

4. Teste de Transição de Estado
   → Validar mudanças de estado
```

#### Comparação

| Aspecto | Caixa-Branca | Caixa-Preta |
|---------|--------------|-------------|
| **Conhecimento do código** | Sim (interno) | Não (externo) |
| **Foco** | Implementação, caminhos | Requisitos, funcionalidade |
| **Técnicas** | Cobertura de código | Valor limite, equivalência |
| **Complexidade** | Alta (precisa entender código) | Baixa (só precisa da spec) |
| **Quem executa** | Desenvolvedores | Testadores/QA |
| **Exemplo** | "Testar todos os branches do if" | "Testar login com senha válida/inválida" |
| **Nível comum** | Testes de unidade | Testes de sistema |

---

#### Exemplos no DoaCin

##### Caixa-Branca: Testando Caminhos de Execução

```javascript
// routes/controllers/dashboardController.js (código existente)

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nome: true, bloodType: true, genero: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const stats = await prisma.donation.aggregate({
      where: { userId: userId, status: 'confirmed' },
      _count: { id: true },
      _sum: { pointsEarned: true }
    });

    const lastDonation = await prisma.donation.findFirst({
      where: { userId: userId, status: 'confirmed' },
      orderBy: { donationDate: 'desc' }
    });

    let daysUntilNextDonation = null;
    let canDonateNow = true;

    if (lastDonation) {
      const daysSinceLastDonation = Math.floor(
        (new Date() - new Date(lastDonation.donationDate)) / (1000 * 60 * 60 * 24)
      );
      
      const minimumInterval = user.genero === 'M' ? 60 : 90;  // BRANCH 1
      daysUntilNextDonation = Math.max(0, minimumInterval - daysSinceLastDonation);
      canDonateNow = daysSinceLastDonation >= minimumInterval;  // BRANCH 2
    }

    res.status(200).json({
      user: {
        nome: user.nome,
        bloodType: user.bloodType
      },
      stats: {
        totalDonations: stats._count.id || 0,
        totalPoints: stats._sum.pointsEarned || 0,
        daysUntilNext: daysUntilNextDonation,
        canDonate: canDonateNow
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter estatísticas' });
  }
};
```

**Teste Caixa-Branca: Cobrir Todos os Caminhos**

```javascript
// __tests__/whitebox/dashboardController.test.js

import { getDashboardStats } from '../../routes/controllers/dashboardController';
import prisma from '../../config/database';

jest.mock('../../config/database');

describe('[CAIXA-BRANCA] getDashboardStats - Cobertura de Caminhos', () => {
  let req, res;
  
  beforeEach(() => {
    req = { user: { userId: 'user-123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });
  
  // CAMINHO 1: Usuário não encontrado
  test('[CAMINHO 1] deve retornar 404 se usuário não existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);  // if (!user)
    
    await getDashboardStats(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    
    // Verifica que não consultou donations (path terminou)
    expect(prisma.donation.aggregate).not.toHaveBeenCalled();
  });
  
  // CAMINHO 2: Usuário existe, sem doações (lastDonation = null)
  test('[CAMINHO 2] deve retornar stats zerados para usuário sem doações', async () => {
    prisma.user.findUnique.mockResolvedValue({
      nome: 'João',
      bloodType: 'O+',
      genero: 'M'
    });
    prisma.donation.aggregate.mockResolvedValue({
      _count: { id: 0 },
      _sum: { pointsEarned: null }
    });
    prisma.donation.findFirst.mockResolvedValue(null);  // if (lastDonation)
    
    await getDashboardStats(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    
    // Se lastDonation é null, não entra no if
    expect(response.stats.daysUntilNext).toBeNull();
    expect(response.stats.canDonate).toBe(true);
  });
  
  // CAMINHO 3: Homem com última doação (genero === 'M')
  test('[CAMINHO 3] deve calcular intervalo de 60 dias para homens', async () => {
    const today = new Date('2025-06-01');
    jest.useFakeTimers().setSystemTime(today);
    
    prisma.user.findUnique.mockResolvedValue({
      nome: 'Carlos',
      bloodType: 'A+',
      genero: 'M'  // BRANCH 1: minimumInterval = 60
    });
    prisma.donation.aggregate.mockResolvedValue({
      _count: { id: 5 },
      _sum: { pointsEarned: 500 }
    });
    prisma.donation.findFirst.mockResolvedValue({
      donationDate: new Date('2025-05-01')  // 31 dias atrás
    });
    
    await getDashboardStats(req, res);
    
    const response = res.json.mock.calls[0][0];
    expect(response.stats.daysUntilNext).toBe(29);  // 60 - 31
    expect(response.stats.canDonate).toBe(false);   // 31 < 60
    
    jest.useRealTimers();
  });
  
  // CAMINHO 4: Mulher com última doação (genero !== 'M')
  test('[CAMINHO 4] deve calcular intervalo de 90 dias para mulheres', async () => {
    const today = new Date('2025-06-01');
    jest.useFakeTimers().setSystemTime(today);
    
    prisma.user.findUnique.mockResolvedValue({
      nome: 'Maria',
      bloodType: 'B+',
      genero: 'F'  // BRANCH 1: minimumInterval = 90
    });
    prisma.donation.aggregate.mockResolvedValue({
      _count: { id: 3 },
      _sum: { pointsEarned: 300 }
    });
    prisma.donation.findFirst.mockResolvedValue({
      donationDate: new Date('2025-04-01')  // 61 dias atrás
    });
    
    await getDashboardStats(req, res);
    
    const response = res.json.mock.calls[0][0];
    expect(response.stats.daysUntilNext).toBe(29);  // 90 - 61
    expect(response.stats.canDonate).toBe(false);   // 61 < 90
    
    jest.useRealTimers();
  });
  
  // CAMINHO 5: Pode doar (daysSince >= minimumInterval)
  test('[CAMINHO 5] deve permitir doação após intervalo mínimo', async () => {
    const today = new Date('2025-06-01');
    jest.useFakeTimers().setSystemTime(today);
    
    prisma.user.findUnique.mockResolvedValue({
      nome: 'Pedro',
      genero: 'M'
    });
    prisma.donation.aggregate.mockResolvedValue({
      _count: { id: 10 },
      _sum: { pointsEarned: 1000 }
    });
    prisma.donation.findFirst.mockResolvedValue({
      donationDate: new Date('2025-03-31')  // 62 dias atrás
    });
    
    await getDashboardStats(req, res);
    
    const response = res.json.mock.calls[0][0];
    expect(response.stats.daysUntilNext).toBe(0);  // Math.max(0, 60 - 62)
    expect(response.stats.canDonate).toBe(true);   // BRANCH 2: 62 >= 60
    
    jest.useRealTimers();
  });
  
  // CAMINHO 6: Erro no try/catch
  test('[CAMINHO 6] deve retornar 500 em caso de erro no banco', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB Error'));
    
    await getDashboardStats(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Erro ao obter estatísticas' 
    });
  });
});

// ANÁLISE DE COBERTURA (Caixa-Branca):
// ✓ Linha 10: if (!user) → Caminho 1
// ✓ Linha 26: if (lastDonation) → Caminhos 2 (false), 3-6 (true)
// ✓ Linha 31: genero === 'M' → Caminhos 3 (true), 4 (false)
// ✓ Linha 33: daysSince >= minimumInterval → Caminhos 3-4 (false), 5 (true)
// ✓ Linha 48: catch → Caminho 6
//
// COBERTURA: 100% de linhas, branches e caminhos
```

##### Caixa-Preta: Testando Requisitos Funcionais

```javascript
// __tests__/blackbox/auth.blackbox.test.js

/**
 * REQUISITOS FUNCIONAIS (Especificação):
 * 
 * RF-01: Sistema deve permitir cadastro de usuário
 *   - Entrada: nome, email, cpf, senha
 *   - Validações:
 *     * Email único
 *     * CPF único e válido (11 dígitos)
 *     * Senha mínimo 6 caracteres
 *   - Saída: Mensagem de sucesso ou erro
 * 
 * RF-02: Sistema deve permitir login
 *   - Entrada: email, senha
 *   - Saída: Token JWT ou erro
 */

describe('[CAIXA-PRETA] RF-01: Cadastro de Usuário', () => {
  // TÉCNICA: Particionamento de Equivalência
  
  describe('Classe de Equivalência: Entradas Válidas', () => {
    test('deve aceitar cadastro com dados válidos', async () => {
      const validInput = {
        nome: 'Ana Silva',
        email: 'ana@example.com',
        cpf: '12345678909',
        password: 'senha123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(validInput);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário registrado com sucesso!');
    });
  });
  
  describe('Classe de Equivalência: Email Inválido', () => {
    test('deve rejeitar email já cadastrado', async () => {
      // Setup: Criar usuário primeiro
      await prisma.user.create({
        data: { email: 'existente@test.com', cpf: '111', password: 'hash' }
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'João',
          email: 'existente@test.com',  // DUPLICADO
          cpf: '22222222222',
          password: 'senha123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('já cadastrado');
    });
  });
  
  describe('Classe de Equivalência: CPF Inválido', () => {
    test('deve rejeitar CPF já cadastrado', async () => {
      await prisma.user.create({
        data: { email: 'user1@test.com', cpf: '12345678909', password: 'hash' }
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Maria',
          email: 'user2@test.com',
          cpf: '12345678909',  // DUPLICADO
          password: 'senha123'
        });
      
      expect(response.status).toBe(400);
    });
  });
});

describe('[CAIXA-PRETA] RF-02: Login de Usuário', () => {
  // TÉCNICA: Análise de Valor Limite
  
  beforeEach(async () => {
    const hash = await bcrypt.hash('senha_correta', 12);
    await prisma.user.create({
      data: {
        email: 'login@test.com',
        cpf: '11111111111',
        password: hash
      }
    });
  });
  
  describe('Análise de Valor Limite: Senha', () => {
    test('[LIMITE VÁLIDO] deve aceitar senha correta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'senha_correta'  // VALOR VÁLIDO
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
    
    test('[LIMITE INVÁLIDO] deve rejeitar senha incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'senha_errada'  // VALOR INVÁLIDO
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email ou senha inválidos.');
    });
    
    test('[LIMITE INVÁLIDO] deve rejeitar senha vazia', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: ''  // VALOR LIMITE (vazio)
        });
      
      expect(response.status).toBe(401);
    });
  });
});

// CAIXA-PRETA - CARACTERÍSTICAS:
// ✓ NÃO olha código (testa como usuário)
// ✓ Foca em requisitos funcionais
// ✓ Usa técnicas: equivalência, valor limite
// ✓ Testa entradas válidas/inválidas
// ✓ Valida especificação, não implementação
```

##### Comparação Prática: Mesma Função, Dois Enfoques

**Função:** Validação de peso mínimo para doação

```javascript
// utils/donationValidator.js

export function canDonateByWeight(weight, gender) {
  // Requisito: Homem >= 50kg, Mulher >= 50kg
  const minimumWeight = 50;
  
  if (typeof weight !== 'number' || weight <= 0) {
    return { canDonate: false, reason: 'Peso inválido' };
  }
  
  if (weight < minimumWeight) {
    return { 
      canDonate: false, 
      reason: `Peso mínimo: ${minimumWeight}kg` 
    };
  }
  
  return { canDonate: true, reason: null };
}
```

**Teste Caixa-Branca (foco na implementação):**

```javascript
describe('[CAIXA-BRANCA] canDonateByWeight', () => {
  test('deve entrar no primeiro if com weight não numérico', () => {
    const result = canDonateByWeight('abc', 'M');  // typeof weight !== 'number'
    expect(result.canDonate).toBe(false);
  });
  
  test('deve entrar no primeiro if com weight zero', () => {
    const result = canDonateByWeight(0, 'M');  // weight <= 0
    expect(result.canDonate).toBe(false);
  });
  
  test('deve entrar no segundo if com peso abaixo do mínimo', () => {
    const result = canDonateByWeight(49, 'M');  // weight < minimumWeight
    expect(result.reason).toContain('50kg');
  });
  
  test('deve passar todos os ifs e retornar sucesso', () => {
    const result = canDonateByWeight(50, 'M');  // Caminho de sucesso
    expect(result.canDonate).toBe(true);
  });
  
  // Cobertura: 100% de branches
});
```

**Teste Caixa-Preta (foco nos requisitos):**

```javascript
describe('[CAIXA-PRETA] Requisito: Peso Mínimo para Doação', () => {
  // Particionamento de Equivalência
  
  test('[VÁLIDO] peso acima do mínimo deve permitir doação', () => {
    expect(canDonateByWeight(60, 'M').canDonate).toBe(true);
    expect(canDonateByWeight(55, 'F').canDonate).toBe(true);
  });
  
  test('[INVÁLIDO] peso abaixo do mínimo deve bloquear doação', () => {
    expect(canDonateByWeight(45, 'M').canDonate).toBe(false);
    expect(canDonateByWeight(48, 'F').canDonate).toBe(false);
  });
  
  // Análise de Valor Limite
  
  test('[LIMITE] exatamente 50kg deve permitir doação', () => {
    expect(canDonateByWeight(50, 'M').canDonate).toBe(true);
    expect(canDonateByWeight(50, 'F').canDonate).toBe(true);
  });
  
  test('[LIMITE] 49.9kg deve bloquear doação', () => {
    expect(canDonateByWeight(49.9, 'M').canDonate).toBe(false);
  });
  
  test('[LIMITE] 50.1kg deve permitir doação', () => {
    expect(canDonateByWeight(50.1, 'M').canDonate).toBe(true);
  });
  
  // Validação de requisito, não de implementação
});
```

**Diferenças:**

| Aspecto | Caixa-Branca | Caixa-Preta |
|---------|--------------|-------------|
| **Comentários** | "entra no primeiro if" | "peso acima do mínimo" |
| **Foco** | Caminhos do código | Regras de negócio |
| **Conhecimento** | Sabe dos `if` internos | Só sabe o requisito (50kg) |
| **Mudança de implementação** | Quebra se refatorar | Continua funcionando |
| **Valor** | Garante cobertura | Garante especificação |

---

## Resumo do Capítulo 8

### 8.1 Tipos de Testes ✅
- **Testes de Unidade**: Funções isoladas, mocks, rápidos
- **Testes de Integração**: Módulos + banco/API, moderados
- **Testes de Sistema**: End-to-end, completo, lentos
- **Pirâmide**: 70% unidade, 20% integração, 10% sistema

### 8.2 Exemplos no DoaCin ✅
**Testes de Unidade (3 exemplos):**
1. Validação de CPF
2. Cálculo de intervalo de doação (género)
3. Hash de senha (bcrypt)

**Testes de Integração (3 exemplos):**
1. Registro de usuário (API + Banco)
2. Login e JWT (autenticação completa)
3. Criar doação (com middleware auth)

**Testes de Sistema (3 exemplos):**
1. Fluxo completo de doação
2. Cadastro e primeiro acesso
3. Experiência mobile

### 8.3 Caixa-Branca vs Caixa-Preta ✅
- **Caixa-Branca**: Conhece código, cobertura, caminhos
- **Caixa-Preta**: Requisitos, equivalência, limites
- **Comparação detalhada** com tabelas
- **3 exemplos práticos** no DoaCin

**Total de exemplos de código**: 15+
**Frameworks mencionados**: Jest, Supertest, Cypress

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - Capítulo 8: Testes*
