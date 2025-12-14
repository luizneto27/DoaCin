# Respostas - Capítulo 3: Requisitos aplicados ao DoaCin

## Capítulo 3: Requisitos

### 3.1 MVP (Minimum Viable Product)

#### Definição Completa

**MVP** (Produto Mínimo Viável) é uma versão de um novo produto que possui apenas as funcionalidades essenciais necessárias para validar a ideia de negócio e começar o processo de aprendizado o mais rápido possível.

#### Conceitos-Chave do MVP

**1. Mínimo:**
- Conjunto reduzido de funcionalidades
- Apenas o essencial para resolver o problema principal
- Não inclui recursos "nice to have"

**2. Viável:**
- Funcional e utilizável por usuários reais
- Resolve o problema core de forma satisfatória
- Pode ser entregue e mantido com os recursos disponíveis

**3. Produto:**
- Algo que entrega valor real
- Não é um protótipo ou mockup
- Usuários podem efetivamente usar

#### Objetivos do MVP

| Objetivo | Descrição |
|----------|-----------|
| **Validação de Hipóteses** | Testar se a solução resolve o problema real |
| **Feedback Rápido** | Obter retorno de usuários reais rapidamente |
| **Redução de Custos** | Minimizar investimento inicial |
| **Aprendizado** | Descobrir o que funciona e o que não funciona |
| **Time-to-Market** | Lançar rapidamente no mercado |
| **Iteração** | Base para evolução incremental do produto |

#### Estratégias de MVP

**1. MVP Concierge:**
- Serviço manual como se fosse automatizado
- Exemplo: Processar pedidos manualmente antes de construir o sistema

**2. MVP Wizard of Oz:**
- Interface automatizada, mas backend manual
- Usuário pensa que é automático

**3. MVP de Feature Única:**
- Uma funcionalidade principal muito bem feita
- Foco absoluto no problema core

**4. MVP Landing Page:**
- Página explicando o produto
- Mede interesse antes de construir

**5. MVP Protótipo:**
- Versão simplificada funcional
- Menos features, mais rapidez

#### MVP do DoaCin

##### Problema Principal que o MVP Resolve

**"Doadores de sangue precisam de uma forma centralizada de acompanhar suas doações e encontrar locais para doar."**

##### Funcionalidades do MVP do DoaCin

**INCLUÍDAS no MVP (Must Have):**

| # | Funcionalidade | Justificativa | Complexidade |
|---|----------------|---------------|--------------|
| 1 | **Autenticação** (Login/Registro) | Sem isso, não há personalização | Alta |
| 2 | **Dashboard Básico** | Visão geral essencial para o doador | Média |
| 3 | **Saldo de Capibas** | Core da gamificação para engajamento | Média |
| 4 | **Histórico de Doações** | Rastreabilidade essencial | Média |
| 5 | **Lista de Locais de Coleta** | Responde "onde doar?" | Média |
| 6 | **Adicionar Doação Manualmente** | Registro inicial de dados | Baixa |

**EXCLUÍDAS do MVP (Nice to Have):**

| # | Funcionalidade | Por que foi excluída | Quando adicionar |
|---|----------------|----------------------|------------------|
| 1 | **Validação por QR Code** | Complexa, requer infraestrutura física | V2 - Após parcerias |
| 2 | **Quiz Educativo** | Não é core, é engajamento extra | V2 - Após tração |
| 3 | **Mapa Interativo** | Lista simples resolve o problema | V1.5 - Melhoria UX |
| 4 | **Integração Conecta Recife** | Dependência externa, pode ser manual | V2 - Escalabilidade |
| 5 | **Sistema de Recompensas** | Gamificação avançada | V3 - Maturidade |
| 6 | **Agendamentos** | Adiciona complexidade desnecessária | V2 - Demanda validada |
| 7 | **Notificações Push** | Infraestrutura adicional | V2 - Retenção |

##### Comparação: MVP vs Versão Atual do DoaCin

**Versão Atual do DoaCin:**

O DoaCin atual está **além do MVP**, incluindo funcionalidades de V1.5/V2:

```
MVP Puro → V1.5 (MVP+) → V2.0 → Versão Atual
   ↓           ↓            ↓          ↓
 Básico    + Mapa      + Quiz    + QR Code
                                 + Integração API
```

**Análise do Estado Atual:**

| Funcionalidade | Status | Versão |
|----------------|--------|--------|
| Autenticação JWT | ✅ Implementado | MVP |
| Dashboard com Métricas | ✅ Implementado | MVP |
| Histórico de Doações | ✅ Implementado | MVP |
| Sistema de Capibas | ✅ Implementado | MVP |
| Adicionar Doação Manual | ✅ Implementado | MVP |
| Lista de Locais | ✅ Implementado | MVP |
| **Mapa Interativo (Leaflet)** | ✅ Implementado | V1.5 |
| **Quiz Educativo** | ✅ Implementado | V2.0 |
| **Regras de Doação** | ✅ Implementado | V2.0 |
| **Validação QR Code** | ✅ Implementado | V2.5 |
| **Integração Conecta Recife** | ✅ Implementado | V2.5 |
| Agendamentos | ⚠️ Parcial (schema existe) | V2.5 |
| Perfil de Usuário | ✅ Implementado | V1.5 |

##### Roadmap Evolutivo do DoaCin

```
📦 MVP (Sprint 1-2)
├── Autenticação básica
├── Dashboard simples
├── Histórico de doações
└── Lista de locais (sem mapa)

📦 V1.5 - Melhorias de UX (Sprint 3-4)
├── Mapa interativo com marcadores
├── Filtros de locais (fixos/eventos)
├── Perfil editável
└── Cooldown visual aprimorado

📦 V2.0 - Educação e Engajamento (Sprint 5-6)
├── Quiz educativo
├── Regras de doação de sangue
├── Gráficos de progresso
└── Stats avançadas (vidas salvas)

📦 V2.5 - Integração e Validação (Sprint 7-8)
├── Integração Conecta Recife API
├── QR Code para validação
├── Gamificação externa
└── Sistema de agendamentos

📦 V3.0 - Futuro (não implementado)
├── Notificações push
├── Sistema de recompensas
├── Comunidade de doadores
└── Campanhas personalizadas
```

#### Métricas de Sucesso para o MVP do DoaCin

Para validar se o MVP está funcionando:

| Métrica | Objetivo | Como Medir |
|---------|----------|------------|
| **Taxa de Cadastro** | >30% dos visitantes | Analytics de conversão |
| **Doações Registradas** | >5 por usuário | Query no banco |
| **Retenção (30 dias)** | >40% retornam | Análise de login dates |
| **Uso do Mapa** | >70% dos usuários | Event tracking |
| **NPS (Net Promoter Score)** | >50 | Pesquisa in-app |

#### Lições do MVP

**O que o MVP ensina:**
1. **Qual funcionalidade é realmente usada** (dados de analytics)
2. **Onde usuários têm dificuldade** (heatmaps, session recordings)
3. **Quais features pedir primeiro** (feedback direto)
4. **Se a proposta de valor funciona** (retenção e engajamento)

---

### 3.2 Use Cases do DoaCin

#### O que é um Use Case?

**Use Case** (Caso de Uso) é uma descrição detalhada de como um usuário interage com o sistema para atingir um objetivo específico. Ele documenta o fluxo de eventos desde o início até o resultado.

#### Estrutura de um Use Case

| Elemento | Descrição |
|----------|-----------|
| **Nome** | Título descritivo do caso de uso |
| **Ator** | Quem interage com o sistema |
| **Pré-condições** | Estado necessário antes de iniciar |
| **Pós-condições** | Estado do sistema após conclusão |
| **Fluxo Principal** | Sequência normal de eventos |
| **Fluxos Alternativos** | Variações do fluxo principal |
| **Fluxos de Exceção** | O que fazer quando algo dá errado |

#### Use Case 1: Registrar Nova Doação

**Nome:** UC-01: Registrar Nova Doação Manual

**Ator Principal:** Doador Autenticado

**Pré-condições:**
- Usuário está logado no sistema
- Usuário tem token JWT válido

**Pós-condições de Sucesso:**
- Nova doação é criada com status "pending"
- Doação aparece no histórico do usuário
- Dashboard é atualizado
- Se local não existir, é criado automaticamente

**Pós-condições de Falha:**
- Mensagem de erro é exibida
- Nenhuma alteração no banco de dados

**Fluxo Principal (Caminho Feliz):**

```
1. Usuário navega para a página "Doações" (/doacoes)
2. Sistema exibe histórico de doações existentes
3. Usuário clica no botão "Adicionar Nova Doação"
4. Sistema exibe formulário modal com campos:
   - Data da Doação (campo de data)
   - Hemocentro (campo de texto)
   - Observações (campo de texto, opcional)
5. Usuário preenche a data da doação (ex: 2024-11-15)
6. Usuário digita o nome do hemocentro (ex: "HEMOPE Recife")
7. [Opcional] Usuário adiciona observações
8. Usuário clica em "Salvar"
9. Sistema valida os dados:
   ✓ Data não está vazia
   ✓ Hemocentro não está vazio
   ✓ Data não é futura
10. Sistema envia requisição POST /api/donations
11. Backend verifica autenticação via JWT
12. Backend busca ponto de coleta por nome (mode: insensitive)
13. [Se não encontrar] Backend cria novo PontoColeta
14. Backend cria registro de Donation:
    - userId: do token JWT
    - pontoColetaId: encontrado ou criado
    - donationDate: data fornecida
    - status: "pending"
    - pointsEarned: 0 (aguardando confirmação)
15. Backend retorna sucesso (201 Created)
16. Frontend fecha o modal
17. Frontend recarrega lista de doações
18. Sistema exibe mensagem: "Doação registrada com sucesso!"
19. Nova doação aparece no topo da lista com badge "Pendente"
```

**Fluxos Alternativos:**

**FA-01: Hemocentro já existe**
```
No passo 12:
12a. Backend encontra PontoColeta existente com nome similar
12b. Backend usa o ID do PontoColeta existente
12c. Continua no passo 14
```

**FA-02: Usuário cancela o formulário**
```
No passo 8:
8a. Usuário clica em "Cancelar" ou fora do modal
8b. Sistema fecha o modal sem salvar
8c. Use Case termina
```

**FA-03: Preenchimento via navegação de Campanhas**
```
No passo 3:
3a. Usuário veio da página Campanhas com state.openNew = true
3b. Sistema abre o modal automaticamente
3c. Sistema preenche campo "Hemocentro" com local selecionado
3d. Usuário apenas confirma data e salva
3e. Continua no passo 9
```

**Fluxos de Exceção:**

**FE-01: Validação falha - Campos obrigatórios vazios**
```
No passo 9:
9a. Sistema detecta que data ou hemocentro está vazio
9b. Sistema exibe mensagens de erro vermelhas abaixo dos campos:
    - "Data da doação é obrigatória"
    - "Hemocentro é obrigatório"
9c. Campos com erro são destacados em vermelho
9d. Foco retorna ao primeiro campo com erro
9e. Use Case retorna ao passo 5
```

**FE-02: Erro de autenticação**
```
No passo 11:
11a. Backend detecta token JWT inválido ou expirado
11b. Backend retorna 401 Unauthorized
11c. Frontend detecta erro de autenticação
11d. Frontend redireciona para /login
11e. Sistema exibe: "Sessão expirada. Faça login novamente."
```

**FE-03: Erro no servidor**
```
No passo 14:
14a. Banco de dados está indisponível
14b. Backend retorna 500 Internal Server Error
14c. Frontend exibe mensagem: "Erro ao registrar doação. Tente novamente."
14d. Modal permanece aberto com dados preenchidos
14e. Use Case retorna ao passo 8
```

**FE-04: Data no futuro**
```
No passo 9:
9a. Sistema detecta que data da doação é posterior à data atual
9b. Sistema exibe erro: "A data da doação não pode ser futura"
9c. Use Case retorna ao passo 5
```

**Regras de Negócio:**

| ID | Regra | Aplicação |
|----|-------|-----------|
| RN-01 | Data da doação não pode ser futura | Validação frontend e backend |
| RN-02 | Hemocentro deve ter no mínimo 3 caracteres | Validação frontend |
| RN-03 | Doação manual sempre inicia com status "pending" | Backend |
| RN-04 | Pontos só são creditados após confirmação | Backend |
| RN-05 | Se PontoColeta não existe, criar automaticamente | Backend |
| RN-06 | Busca de hemocentro é case-insensitive | Backend (Prisma mode) |

**Diagrama de Sequência (formato texto):**

```
Doador          Frontend        Backend         Prisma/DB
  |                |               |               |
  |--clica botão-->|               |               |
  |                |--modal aberto |               |
  |<--formulário---|               |               |
  |                |               |               |
  |--preenche form>|               |               |
  |--clica Salvar->|               |               |
  |                |--valida dados |               |
  |                |--POST /api/---|               |
  |                |   donations   |               |
  |                |               |--verifica JWT-|
  |                |               |--busca local--|
  |                |               |<--result-----|
  |                |               |--cria doação--|
  |                |               |<--donation---|
  |                |<--201 success |               |
  |                |--fecha modal  |               |
  |                |--GET /api/----|               |
  |                |   donations   |--findMany----|
  |                |<--donations---|<--result-----|
  |<--lista atualiz|               |               |
```

---

#### Use Case 2: Visualizar Locais de Coleta no Mapa

**Nome:** UC-02: Visualizar Locais de Coleta no Mapa Interativo

**Ator Principal:** Doador Autenticado

**Pré-condições:**
- Usuário está logado no sistema
- Navegador suporta geolocalização (opcional)

**Pós-condições de Sucesso:**
- Mapa é carregado com todos os locais de coleta
- Marcadores são exibidos com cores corretas (vermelho=fixo, laranja=evento)
- Usuário pode interagir com o mapa

**Fluxo Principal:**

```
1. Usuário navega para página "Campanhas" (/campanhas)
2. Sistema exibe tela de loading
3. Frontend envia GET /api/campaigns/locals
4. Backend busca todos os PontoColeta no banco
5. Backend formata dados:
   - Normaliza campos (nome→name, endereco→address)
   - Converte latitude/longitude para float
   - Traduz tipo (fixed/event → fixo/evento)
6. Backend retorna JSON com array de locais
7. Frontend processa dados recebidos
8. Sistema inicializa mapa Leaflet:
   - Centro: [-8.0476, -34.8770] (Recife)
   - Zoom: 12
   - TileLayer: OpenStreetMap
9. Para cada local, sistema cria marcador:
   - Se tipo="fixo": ícone vermelho
   - Se tipo="evento": ícone laranja
   - Posição: [latitude, longitude]
10. Sistema adiciona popup a cada marcador:
    - Título: nome do local
    - Endereço
    - Horário de funcionamento
    - Telefone (se disponível)
    - Botão "Ver Detalhes"
11. Sistema exibe lista lateral com cards dos locais
12. Mapa é exibido totalmente carregado
```

**Fluxos Alternativos:**

**FA-01: Filtrar por tipo de local**
```
No passo 12:
12a. Usuário seleciona filtro "Fixos" ou "Eventos"
12b. Sistema filtra marcadores no mapa
12c. Lista lateral atualiza exibindo apenas locais do tipo selecionado
12d. Marcadores não filtrados são removidos temporariamente
```

**FA-02: Clicar em marcador**
```
No passo 12:
12a. Usuário clica em um marcador no mapa
12b. Sistema abre popup com informações
12c. Sistema centraliza mapa no marcador (flyTo com animação)
12d. Card correspondente na lista lateral é destacado
```

**FA-03: Clicar em card da lista**
```
No passo 12:
12a. Usuário clica em um card na lista lateral
12b. Sistema define este local como "selectedLocal"
12c. Mapa anima até o marcador (flyTo, zoom 16, 1.5s)
12d. Popup do marcador abre automaticamente
```

**FA-04: Clicar em "Adicionar Doação" do card**
```
No passo 12:
12a. Usuário clica em "Adicionar Doação" no card
12b. Sistema navega para /doacoes com state:
    - openNew: true
    - prefillLocalId: id do local
12c. Página de doações abre com modal pré-preenchido
12d. [Continua em UC-01 passo 3c]
```

**Fluxos de Exceção:**

**FE-01: Nenhum local encontrado**
```
No passo 6:
6a. Backend retorna array vazio
6b. Frontend detecta locals.length === 0
6c. Sistema exibe mensagem: "Nenhum local de coleta cadastrado"
6d. Mapa é exibido vazio (apenas o mapa base)
```

**FE-02: Coordenadas inválidas**
```
No passo 9:
9a. Sistema detecta latitude ou longitude nulas/inválidas
9b. Sistema pula este local (não cria marcador)
9c. Console.warn: "Local sem coordenadas: [nome]"
9d. Continua processando próximo local
```

**FE-03: Erro ao carregar mapa**
```
No passo 8:
8a. Leaflet falha ao carregar tiles (rede offline)
8b. Sistema exibe placeholder com fundo cinza
8c. Mensagem: "Erro ao carregar mapa. Verifique sua conexão."
8d. Lista lateral ainda funciona normalmente
```

**Diagrama de Atividades:**

```
[Início]
   ↓
[Navega para /campanhas]
   ↓
[Loading exibido]
   ↓
[GET /api/campaigns/locals]
   ↓
<Dados retornados com sucesso?>
   ├─Não→ [Exibe erro] → [Fim]
   ↓ Sim
[Processa dados]
   ↓
[Inicializa mapa Leaflet]
   ↓
[Loop: Para cada local]
   ├─[Verifica coordenadas]
   │   ├─Inválidas → [Pula]
   │   └─Válidas ↓
   ├─[Cria marcador com ícone correto]
   ├─[Adiciona popup]
   └─[Próximo local]
   ↓
[Exibe mapa completo]
   ↓
<Usuário interage?>
   ├─[Clica marcador] → [Abre popup]
   ├─[Clica card] → [FlyTo marcador]
   ├─[Filtra tipo] → [Atualiza exibição]
   └─[Adiciona doação] → [Navega para UC-01]
   ↓
[Fim]
```

**Atores Secundários:**
- **API OpenStreetMap**: Fornece tiles do mapa
- **Conecta Recife API**: Pode fornecer dados de locais (integração externa)

---

#### Use Case 3: Confirmar Doação via QR Code

**Nome:** UC-03: Confirmar Doação via Validação de QR Code

**Ator Principal:** Funcionário do Ponto de Coleta

**Ator Secundário:** Sistema DoaCin (Backend)

**Pré-condições:**
- Doação foi registrada no sistema com status "pending"
- QR Code foi gerado para a doação
- Funcionário tem acesso ao sistema de validação

**Pós-condições de Sucesso:**
- Status da doação atualizado para "confirmed"
- 10 Capibas creditados ao doador
- Gamificação registrada no Conecta Recife (se integrado)
- Doador recebe notificação de confirmação

**Fluxo Principal:**

```
1. Doador apresenta QR Code no ponto de coleta
2. Funcionário acessa sistema de validação
3. Funcionário escaneia QR Code ou insere código manualmente
4. Sistema decodifica QR Code e extrai:
   - donationId (UUID)
   - userId (UUID)
   - timestamp de geração
5. Sistema envia POST /api/donations/confirm com:
   - donationId
   - validationCode (hash do QR)
6. Backend verifica autenticidade:
   - Doação existe?
   - Status atual é "pending"?
   - Código corresponde ao hash esperado?
   - QR Code não expirou? (< 24h)
7. Backend atualiza registro Donation:
   - status: "confirmed"
   - pointsEarned: 10
   - validatedByQR: true
   - confirmedAt: now()
8. Backend busca dados do usuário (CPF)
9. Backend busca coordenadas do ponto de coleta
10. [Se integrado] Backend chama registrarGamificacao():
    - POST /api/check-in/location/challenge/{id}/requirement/{id}
    - Envia: document (CPF), latitude, longitude
11. Sistema retorna sucesso (200 OK)
12. Frontend exibe: "Doação confirmada com sucesso!"
13. Dashboard do doador atualiza automaticamente
14. Saldo de Capibas aumenta em 10
```

**Fluxos Alternativos:**

**FA-01: QR Code já foi usado**
```
No passo 6:
6a. Backend detecta que status já é "confirmed"
6b. Backend retorna 400 Bad Request:
    - error: "Doação já foi confirmada anteriormente"
6c. Sistema exibe: "Este QR Code já foi utilizado"
6d. Use Case termina
```

**FA-02: Gamificação externa falha**
```
No passo 10:
10a. Conecta Recife API retorna erro ou timeout
10b. Sistema loga erro no console (console.error)
10c. Doação é confirmada localmente de qualquer forma
10d. Sistema continua no passo 11
10e. [Background] Sistema pode tentar reenviar posteriormente
```

**Fluxos de Exceção:**

**FE-01: Doação não encontrada**
```
No passo 6:
6a. Backend não encontra donationId no banco
6b. Backend retorna 404 Not Found
6c. Sistema exibe: "Doação não encontrada no sistema"
6d. Use Case termina
```

**FE-02: QR Code inválido ou adulterado**
```
No passo 6:
6a. Hash do QR Code não corresponde ao esperado
6b. Backend retorna 401 Unauthorized
6c. Sistema exibe: "QR Code inválido ou adulterado"
6d. Sistema pode gerar alerta de segurança
6e. Use Case termina
```

**FE-03: QR Code expirado**
```
No passo 6:
6a. Timestamp do QR Code > 24 horas
6b. Backend retorna 400 Bad Request
6c. Sistema exibe: "QR Code expirado. Gere um novo código."
6d. Use Case termina
```

**Regras de Negócio:**

| ID | Regra | Justificativa |
|----|-------|---------------|
| RN-01 | Confirmação adiciona 10 Capibas | Padrão de gamificação |
| RN-02 | QR Code válido por 24h | Segurança e prevenção de fraude |
| RN-03 | Apenas doações "pending" podem ser confirmadas | Integridade de estado |
| RN-04 | Um QR Code só pode ser usado uma vez | Prevenir duplicação de pontos |
| RN-05 | Falha na gamificação externa não bloqueia confirmação | Resiliência do sistema |

---

### 3.3 Testes A/B no Contexto do DoaCin

#### O que são Testes A/B?

**Teste A/B** (ou Split Testing) é uma técnica de experimentação onde duas versões de um elemento (A e B) são comparadas para determinar qual performa melhor em relação a uma métrica específica.

#### Metodologia de Testes A/B

**Estrutura:**
```
População de Usuários
        ↓
    [Divisão Aleatória]
        ↓
   ┌─────┴─────┐
   ↓           ↓
Grupo A      Grupo B
(Controle)   (Variação)
   ↓           ↓
Versão A    Versão B
   ↓           ↓
[Coleta de Métricas]
   ↓           ↓
[Análise Estatística]
        ↓
   [Vencedor]
```

**Componentes:**
- **Hipótese**: Suposição sobre o que melhorará a métrica
- **Variável**: Elemento que será testado (cor, texto, layout)
- **Métrica**: KPI que medirá o sucesso (conversão, cliques, tempo)
- **Significância Estatística**: Confiança de que resultado não é acaso (>95%)

#### Exemplo 1: Teste A/B no Botão de Adicionar Doação

**Contexto:** Aumentar a taxa de doações registradas no sistema

**Hipótese:**
> "Um botão de call-to-action maior e com cor contrastante aumentará a taxa de registro de doações em pelo menos 15%"

**Configuração do Teste:**

| Aspecto | Versão A (Controle) | Versão B (Variação) |
|---------|---------------------|---------------------|
| **Texto do Botão** | "Adicionar Nova Doação" | "✨ Registrar Minha Doação" |
| **Cor** | Azul (#007BFF) | Verde vibrante (#10B981) |
| **Tamanho** | Padrão (padding: 12px 24px) | Maior (padding: 16px 32px) |
| **Ícone** | Ícone pequeno (16px) | Ícone maior + emoji (20px) |
| **Posição** | Topo direito | Centralizado + fixo no bottom |

**Implementação Técnica:**

```javascript
// services/abTestingService.js
export const getABTestVariant = (testName) => {
  let userId = localStorage.getItem('userId');
  
  // Deterministic assignment baseado em hash do userId
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const variant = hash % 2 === 0 ? 'A' : 'B';
  
  // Armazena para consistência
  localStorage.setItem(`abTest_${testName}`, variant);
  
  return variant;
};

export const trackABTestEvent = (testName, variant, event, metadata) => {
  const eventData = {
    testName,
    variant,
    event,
    metadata,
    timestamp: new Date().toISOString(),
    userId: localStorage.getItem('userId')
  };
  
  // Envia para analytics
  authFetch('/api/analytics/ab-test', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};
```

```jsx
// DonationsPage.jsx (trecho modificado)
import { getABTestVariant, trackABTestEvent } from '../services/abTestingService';

function DonationsPage() {
  const [abVariant, setAbVariant] = useState('A');
  
  useEffect(() => {
    const variant = getABTestVariant('addDonationButton');
    setAbVariant(variant);
    
    // Track exposure (usuário viu a variante)
    trackABTestEvent('addDonationButton', variant, 'exposure');
  }, []);
  
  const handleAddDonationClick = () => {
    // Track click
    trackABTestEvent('addDonationButton', abVariant, 'click');
    
    setShowModal(true);
  };
  
  const handleDonationSubmit = async () => {
    // ... lógica de submit
    
    if (success) {
      // Track conversion
      trackABTestEvent('addDonationButton', abVariant, 'conversion');
    }
  };
  
  return (
    <div>
      {/* Versão A - Controle */}
      {abVariant === 'A' && (
        <button 
          onClick={handleAddDonationClick}
          className="btn-add-donation-a"
          style={{
            backgroundColor: '#007BFF',
            padding: '12px 24px',
            position: 'absolute',
            top: '20px',
            right: '20px'
          }}
        >
          <PlusIcon size={16} />
          Adicionar Nova Doação
        </button>
      )}
      
      {/* Versão B - Variação */}
      {abVariant === 'B' && (
        <button 
          onClick={handleAddDonationClick}
          className="btn-add-donation-b"
          style={{
            backgroundColor: '#10B981',
            padding: '16px 32px',
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}
        >
          ✨ <PlusIcon size={20} /> Registrar Minha Doação
        </button>
      )}
      
      {/* Resto do componente */}
    </div>
  );
}
```

**Métricas Coletadas:**

| Métrica | Descrição | Fórmula |
|---------|-----------|---------|
| **Taxa de Exposição** | % de usuários que viram o botão | (Views / Total Users) × 100 |
| **Taxa de Clique (CTR)** | % de usuários que clicaram | (Clicks / Views) × 100 |
| **Taxa de Conversão** | % que completaram o registro | (Submissions / Clicks) × 100 |
| **Taxa End-to-End** | % total de sucesso | (Submissions / Views) × 100 |
| **Tempo até Ação** | Média de tempo até clicar | Avg(clickTime - pageLoadTime) |

**Resultados Hipotéticos (após 2 semanas, 1000 usuários):**

| Métrica | Versão A | Versão B | Diferença | Significância |
|---------|----------|----------|-----------|---------------|
| Usuários | 500 | 500 | - | - |
| Views | 480 (96%) | 495 (99%) | +3% | p=0.03 ✓ |
| Clicks | 120 (25%) | 198 (40%) | +60% | p<0.001 ✓✓✓ |
| Conversões | 84 (70%) | 168 (85%) | +21% | p<0.01 ✓✓ |
| Taxa E2E | 17.5% | 34% | **+94%** | p<0.001 ✓✓✓ |

**Conclusão:**
> Versão B vence com 94% de aumento na taxa end-to-end. Implementar permanentemente.

---

#### Exemplo 2: Teste A/B no Onboarding de Novos Usuários

**Contexto:** Aumentar completude de perfil após registro

**Hipótese:**
> "Um wizard de onboarding guiado aumentará a taxa de preenchimento de perfil completo em 40%"

**Configuração:**

| Versão A (Controle) | Versão B (Variação) |
|---------------------|---------------------|
| Após registro → Dashboard diretamente | Após registro → Wizard 3 etapas |
| Banner sugerindo completar perfil | Onboarding obrigatório interativo |
| Pode ser ignorado | Pode pular, mas com incentivo |

**Wizard Versão B:**

```
Etapa 1: Informações Básicas
├─ Tipo sanguíneo (dropdown)
├─ Data de nascimento (date picker)
├─ Gênero (radio buttons)
└─ [Próximo]

Etapa 2: Dados de Contato
├─ Telefone (input mask)
├─ Endereço (autocomplete)
└─ [Próximo]

Etapa 3: Primeira Meta
├─ "Quantas vezes pretende doar este ano?"
├─ Slider: 1-4 doações
└─ [Começar a Doar! 🎉]
```

**Métricas:**

| Métrica | Versão A | Versão B | Resultado |
|---------|----------|----------|-----------|
| Perfil 100% completo (7 dias) | 23% | 67% | +191% ✓✓✓ |
| Primeira doação registrada (30 dias) | 41% | 58% | +41% ✓✓ |
| Retenção D7 | 52% | 61% | +17% ✓ |
| Tempo médio de onboarding | 2min 10s | 3min 45s | +73% |

**Insight:**
> Apesar de aumentar tempo de onboarding em 73%, a versão B melhora significativamente engajamento e completude de perfil. O investimento de tempo inicial compensa.

---

#### Exemplo 3: Teste A/B no Sistema de Pontos (Capibas)

**Contexto:** Aumentar motivação para doar

**Hipótese:**
> "Exibir equivalência de Capibas em benefícios tangíveis aumentará frequência de doações"

**Configuração:**

| Versão A | Versão B |
|----------|----------|
| "Você tem 120 Capibas" | "Você tem 120 Capibas = 12 vidas salvas" |
| Apenas número | Número + barra de progresso para próximo nível |
| Sem contexto | "A cada 100 Capibas, você desbloqueia um certificado" |

**Exemplo Visual Versão B:**

```
╔════════════════════════════════════════╗
║  💎 Seus Capibas: 120                  ║
║                                        ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  120 / 200 para próximo nível         ║
║                                        ║
║  🩸 12 vidas salvas                    ║
║  🏆 Você está no Top 15% de doadores   ║
║                                        ║
║  Próximas Recompensas:                 ║
║  ✓ 100 pts → Certificado Bronze       ║
║  ⏳ 200 pts → Certificado Prata        ║
║  🔒 500 pts → Certificado Ouro         ║
╚════════════════════════════════════════╝
```

**Métricas:**

| Métrica | Versão A | Versão B | Diferença |
|---------|----------|----------|-----------|
| Doações/usuário (60 dias) | 1.8 | 2.4 | +33% ✓✓ |
| Taxa de retorno (2ª doação) | 48% | 62% | +29% ✓✓ |
| Engajamento com dashboard | 3.2 views/semana | 5.1 views/semana | +59% ✓✓✓ |
| NPS (satisfação) | 42 | 58 | +38% ✓ |

**Conclusão:**
> Gamificação com contexto tangível aumenta significativamente engajamento e frequência de doações.

---

#### Exemplo 4: Teste A/B no Design do Mapa de Campanhas

**Contexto:** Melhorar descoberta de locais de coleta

**Hipótese:**
> "Mapa como view principal aumenta interação com campanhas vs lista como principal"

| Versão A (Controle) | Versão B (Variação) |
|---------------------|---------------------|
| Lista em destaque (70% tela) | Mapa em destaque (70% tela) |
| Mapa como sidebar pequeno | Lista como sidebar pequeno |
| Scroll vertical para ver locais | Navegação geográfica visual |

**Métricas:**

| Métrica | Versão A | Versão B | Resultado |
|---------|----------|----------|-----------|
| Locais visualizados (avg) | 4.2 | 8.7 | +107% ✓✓✓ |
| Cliques em "Ver Detalhes" | 28% | 51% | +82% ✓✓✓ |
| Navegação para registrar doação | 12% | 19% | +58% ✓✓ |
| Tempo na página | 1min 23s | 2min 47s | +101% ✓✓ |

---

### 3.4 Questões Específicas

#### Questão 1: Quais são as 3 partes das User Stories?

Uma User Story segue o formato padrão com **3 componentes principais**:

##### Estrutura Completa

```
Como um [PAPEL/PERSONA],
Eu quero [AÇÃO/FUNCIONALIDADE],
Para que [BENEFÍCIO/VALOR].
```

##### As 3 Partes

| # | Parte | Nome Técnico | Descrição | Exemplo |
|---|-------|--------------|-----------|---------|
| **1** | **Papel/Persona** | Role/Who | Quem é o usuário que se beneficia | "Como um doador de sangue" |
| **2** | **Ação/Funcionalidade** | Action/What | O que o usuário quer fazer | "Eu quero visualizar meu histórico de doações" |
| **3** | **Benefício/Valor** | Value/Why | Por que isso é importante (valor de negócio) | "Para que eu possa acompanhar minha contribuição e ver meu progresso" |

##### Explicação Detalhada de Cada Parte

**1. PAPEL/PERSONA (Quem?)**

Define o tipo de usuário que terá a necessidade. Ajuda a entender o contexto e perspectiva.

Exemplos no DoaCin:
- "Como um **doador de primeira viagem**"
- "Como um **doador recorrente**"
- "Como um **funcionário do hemocentro**"
- "Como um **administrador do sistema**"
- "Como um **doador com tipo sanguíneo raro**"

**2. AÇÃO/FUNCIONALIDADE (O quê?)**

Descreve a funcionalidade ou ação que o usuário deseja executar. Deve ser clara e específica.

Exemplos no DoaCin:
- "Eu quero **ver meu saldo de Capibas**"
- "Eu quero **filtrar locais por proximidade**"
- "Eu quero **validar uma doação por QR Code**"
- "Eu quero **receber lembrete quando puder doar novamente**"

**3. BENEFÍCIO/VALOR (Por quê?)**

Explica o valor ou benefício que a funcionalidade traz. Justifica por que desenvolver esta feature.

Exemplos no DoaCin:
- "Para que **eu possa me sentir motivado a continuar doando**"
- "Para que **eu economize tempo encontrando o local mais conveniente**"
- "Para que **o sistema registre automaticamente a doação confirmada**"
- "Para que **eu não perca o momento ideal para minha próxima doação**"

##### Exemplo Completo Anotado

```
┌─────────────────────────────────────────────────────────┐
│  Como um doador de sangue iniciante,            [PAPEL] │
│  Eu quero ver as regras de doação explicadas,  [AÇÃO]  │
│  Para que eu saiba se estou apto a doar.     [BENEFÍCIO]│
└─────────────────────────────────────────────────────────┘

Critérios de Aceitação:
✓ Página exibe requisitos básicos (idade, peso, saúde)
✓ Lista impedimentos temporários (tatuagem, viagem)
✓ Lista impedimentos definitivos
✓ Design claro e de fácil leitura
✓ Acessível via menu principal
```

##### Componentes Adicionais (Boas Práticas)

Além das 3 partes principais, User Stories completas incluem:

| Componente | Descrição | Exemplo |
|------------|-----------|---------|
| **Critérios de Aceitação** | Condições para considerar "Done" | "✓ Saldo exibido com 2 casas decimais" |
| **Story Points** | Estimativa de esforço | 5 pontos (Fibonacci) |
| **Prioridade** | Importância no backlog | Alta/Média/Baixa ou MoSCoW |
| **Dependências** | Outras stories necessárias | "Depende de US-01: Login" |
| **Testes** | Como será testado | "Teste manual: criar doação e verificar pontos" |

##### Princípios INVEST para User Stories

User Stories devem seguir:

| Letra | Princípio | Descrição |
|-------|-----------|-----------|
| **I** | Independent | Independente de outras stories |
| **N** | Negotiable | Aberta a discussão e refinamento |
| **V** | Valuable | Entrega valor ao usuário/negócio |
| **E** | Estimable | Pode ser estimada pela equipe |
| **S** | Small | Pequena o suficiente para caber em uma sprint |
| **T** | Testable | Possui critérios de aceitação claros |

---

#### Questão 2: Escreva uma História Épica do DoaCin

##### O que é uma História Épica (Epic)?

**Epic** é uma User Story muito grande que não pode ser completada em uma única sprint. Ela representa uma iniciativa maior que será decomposta em múltiplas User Stories menores.

**Características:**
- Muito grande para caber em uma sprint (>21 story points)
- Alto nível de abstração
- Será quebrada em stories menores
- Geralmente representa uma feature completa ou módulo

##### Epic do DoaCin: Sistema de Gamificação Completo

```
═══════════════════════════════════════════════════════════
                     ÉPICO - DOAC-001
           Sistema de Gamificação e Recompensas
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│  Como um doador de sangue regular,                      │
│  Eu quero participar de um sistema completo de          │
│  gamificação com pontos, níveis, conquistas e           │
│  recompensas tangíveis,                                  │
│  Para que eu me sinta motivado a doar com frequência    │
│  e possa ser reconhecido pela minha contribuição à      │
│  sociedade.                                              │
└─────────────────────────────────────────────────────────┘

VALOR DE NEGÓCIO:
- Aumentar retenção de doadores em 45%
- Aumentar frequência de doações em 60%
- Criar senso de comunidade e pertencimento
- Reduzir desistência de doadores inativos em 30%

MÉTRICAS DE SUCESSO:
- Taxa de doadores recorrentes (>3 doações/ano): de 28% para 50%
- NPS (Net Promoter Score): de 42 para 65+
- Doações por usuário ativo: de 1.8 para 3.2/ano
- Reativação de inativos: 25% dos inativos voltam a doar

ESTIMATIVA TOTAL: 89 Story Points (Epic - dividir em 3 sprints)

PRIORIDADE: Alta (Diferencial competitivo)

DEPENDÊNCIAS:
- Sistema de autenticação (concluído)
- Dashboard básico (concluído)
- Histórico de doações (concluído)
- Integração com API externa (parcialmente concluído)
```

##### Decomposição da Epic em User Stories

```
EPIC: Sistema de Gamificação Completo (89 pts)
│
├─ SPRINT 1: Fundação da Gamificação (30 pts)
│  │
│  ├─ US-GAME-01: Sistema de Pontos Capibas (8 pts)
│  │  "Como doador, quero ganhar 10 Capibas por doação confirmada,
│  │   para que eu veja recompensa tangível pelo meu esforço"
│  │  Critérios:
│  │  ✓ Pontos creditados automaticamente após confirmação
│  │  ✓ Saldo exibido no dashboard
│  │  ✓ Histórico de ganhos de pontos
│  │
│  ├─ US-GAME-02: Sistema de Níveis (13 pts)
│  │  "Como doador, quero progredir em níveis baseado em pontos,
│  │   para que eu tenha objetivos de longo prazo"
│  │  Critérios:
│  │  ✓ 5 níveis: Bronze, Prata, Ouro, Platina, Diamante
│  │  ✓ Requisitos: 0, 100, 300, 600, 1000 Capibas
│  │  ✓ Badge visual no perfil
│  │  ✓ Animação ao subir de nível
│  │
│  └─ US-GAME-03: Ranking de Doadores (9 pts)
│     "Como doador, quero ver um ranking dos top doadores,
│      para que eu me sinta motivado a competir positivamente"
│     Critérios:
│     ✓ Leaderboard com top 10 doadores do mês
│     ✓ Posição do usuário destacada
│     ✓ Filtros: mensal, trimestral, anual
│     ✓ Atualização em tempo real
│
├─ SPRINT 2: Conquistas e Certificados (31 pts)
│  │
│  ├─ US-GAME-04: Sistema de Conquistas (13 pts)
│  │  "Como doador, quero desbloquear conquistas por marcos,
│  │   para que eu tenha múltiplos objetivos a alcançar"
│  │  Critérios:
│  │  ✓ 20 conquistas diferentes:
│  │    - "Primeira Gota" (1ª doação)
│  │    - "Veterano" (10 doações)
│  │    - "Herói" (25 doações)
│  │    - "Lenda" (50 doações)
│  │    - "Sequência de Ouro" (3 doações consecutivas)
│  │    - "Madrugador" (doação antes das 8h)
│  │    - "Explorador" (doar em 5 locais diferentes)
│  │  ✓ Notificação ao desbloquear
│  │  ✓ Galeria de conquistas no perfil
│  │  ✓ Conquistas bloqueadas mostram progresso
│  │
│  ├─ US-GAME-05: Certificados Digitais (10 pts)
│  │  "Como doador, quero receber certificados digitais,
│  │   para que eu possa compartilhar minhas conquistas"
│  │  Critérios:
│  │  ✓ Certificado gerado automaticamente a cada nível
│  │  ✓ PDF com nome, nível, data, pontos
│  │  ✓ QR Code de verificação
│  │  ✓ Botão "Compartilhar nas redes sociais"
│  │
│  └─ US-GAME-06: Streaks (Sequências) (8 pts)
│     "Como doador, quero manter sequências de doações regulares,
│      para que eu seja incentivado a manter consistência"
│     Critérios:
│     ✓ Contador de meses consecutivos doando
│     ✓ Bônus de +5 Capibas por streak >6 meses
│     ✓ Visualização de calendário com doações
│     ✓ Alerta quando streak está em risco
│
└─ SPRINT 3: Recompensas e Social (28 pts)
   │
   ├─ US-GAME-07: Sistema de Recompensas (13 pts)
   │  "Como doador, quero trocar Capibas por recompensas reais,
   │   para que eu tenha incentivo tangível além do altruísmo"
   │  Critérios:
   │  ✓ Catálogo de recompensas:
   │    - 50 pts → Cupom desconto farmácia parceira
   │    - 100 pts → Ingresso cinema
   │    - 200 pts → Vale-transporte
   │    - 500 pts → Exame médico gratuito
   │  ✓ Sistema de resgate de pontos
   │  ✓ Histórico de resgates
   │  ✓ Integração com parceiros (vouchers)
   │
   ├─ US-GAME-08: Feed Social de Doações (8 pts)
   │  "Como doador, quero ver um feed das doações recentes,
   │   para que eu me sinta parte de uma comunidade"
   │  Critérios:
   │  ✓ Feed público com doações (anônimas ou públicas)
   │  ✓ Opção de deixar mensagem motivacional
   │  ✓ Reações/likes de outros doadores
   │  ✓ Filtro por localidade
   │
   └─ US-GAME-09: Desafios Mensais (7 pts)
      "Como doador, quero participar de desafios mensais,
       para que eu tenha metas de curto prazo"
      Critérios:
      ✓ Desafio do mês exibido no dashboard
      ✓ Exemplos:
        - "Doe 2x este mês" → +50 Capibas
        - "Traga um amigo" → +100 Capibas
      ✓ Progresso visual (barra)
      ✓ Recompensa automática ao completar
```

##### Roadmap Visual da Epic

```
MÊS 1           MÊS 2           MÊS 3           MÊS 4
Sprint 1        Sprint 2        Sprint 3        Polimento
├─ Pontos       ├─ Conquistas   ├─ Recompensas  ├─ Testes A/B
├─ Níveis       ├─ Certificados ├─ Feed Social  ├─ Analytics
└─ Ranking      └─ Streaks      └─ Desafios     └─ Ajustes
   ↓               ↓               ↓               ↓
[MVP Game]   [Engajamento+]  [Monetização]   [Otimização]
```

##### Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Complexidade técnica** | Média | Alto | POC inicial de conquistas |
| **Parcerias para recompensas** | Alta | Médio | Começar com recompensas digitais |
| **Fraude/Gaming** | Média | Alto | Validação rigorosa de doações |
| **Baixa adoção** | Baixa | Alto | Testes A/B em cada feature |

##### Stakeholders

| Stakeholder | Interesse | Envolvimento |
|-------------|-----------|--------------|
| **Doadores** | Motivação e reconhecimento | Usuários finais |
| **Hemocentros** | Aumento de doadores | Validação de doações |
| **Parceiros** | Visibilidade de marca | Fornecimento de recompensas |
| **Equipe Dev** | Entrega de valor | Implementação |
| **Product Owner** | ROI e métricas | Priorização |

---

## Resumo do Capítulo 3

### Tópicos Abordados ✅

1. **MVP (Produto Mínimo Viável)**
   - Conceito destrinchado com objetivos e estratégias
   - MVP do DoaCin definido (6 funcionalidades core)
   - Comparação: MVP vs Versão Atual
   - Roadmap evolutivo (MVP → V1.5 → V2.0 → Atual)
   - Métricas de sucesso

2. **Use Cases Completos**
   - UC-01: Registrar Nova Doação (fluxo principal + 3 alternativos + 4 exceções)
   - UC-02: Visualizar Locais no Mapa (com filtros e interações)
   - UC-03: Confirmar Doação via QR Code (com gamificação externa)
   - Diagramas de sequência e atividades

3. **Testes A/B no DoaCin**
   - 4 exemplos práticos:
     * Botão de adicionar doação (+94% conversão)
     * Wizard de onboarding (+191% perfil completo)
     * Sistema de pontos contextualizado (+33% frequência)
     * Mapa vs Lista (+107% locais visualizados)
   - Código de implementação real
   - Métricas e significância estatística

4. **Questões Específicas**
   - 3 partes das User Stories explicadas (Papel, Ação, Benefício)
   - Princípios INVEST
   - **Epic Completa**: Sistema de Gamificação (89 pts)
     * Decomposição em 9 User Stories
     * 3 sprints planejados
     * Roadmap visual
     * Riscos e stakeholders

**Total de Exemplos Práticos**: 16
**Use Cases Documentados**: 3 completos
**Testes A/B Exemplificados**: 4 com resultados
**User Stories na Epic**: 9

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software - Capítulo 3: Requisitos*
