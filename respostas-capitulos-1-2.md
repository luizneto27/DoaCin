# Respostas - Capítulos 1 e 2: Engenharia de Software aplicada ao DoaCin

## Capítulo 1: Introdução

### 1.1 Engenharia de Requisitos: Requisitos Funcionais vs Não Funcionais

#### Definição

**Requisitos Funcionais** são declarações que descrevem **o que** o sistema deve fazer. Eles especificam funcionalidades, comportamentos e serviços que o software deve fornecer aos seus usuários.

**Requisitos Não Funcionais** descrevem **como** o sistema deve se comportar. Eles especificam critérios de qualidade, restrições e atributos do sistema, como desempenho, segurança, usabilidade, confiabilidade, entre outros.

#### Comparação

| Aspecto | Requisitos Funcionais | Requisitos Não Funcionais |
|---------|----------------------|---------------------------|
| **Foco** | Comportamentos e funcionalidades | Qualidade e restrições |
| **Descrição** | "O sistema deve..." | "O sistema deve ser..." |
| **Testabilidade** | Facilmente testável (funciona ou não) | Requer métricas específicas |
| **Exemplo Geral** | Login de usuário | Tempo de resposta < 2 segundos |

#### Exemplos no DoaCin

**Requisitos Funcionais do DoaCin:**

1. **RF01**: O sistema deve permitir que usuários criem uma conta fornecendo CPF, nome, email e senha
2. **RF02**: O sistema deve permitir que usuários façam login com email e senha
3. **RF03**: O sistema deve exibir o histórico de doações do usuário com status (confirmado, pendente, rejeitado)
4. **RF04**: O sistema deve calcular e exibir o saldo de "Capibas" (pontos) do usuário baseado em doações confirmadas
5. **RF05**: O sistema deve permitir visualizar locais de coleta próximos com mapa interativo
6. **RF06**: O sistema deve exibir o período de cooldown até a próxima doação permitida (baseado no gênero do usuário)
7. **RF07**: O sistema deve permitir agendamento de doações em pontos de coleta
8. **RF08**: O sistema deve validar doações através de código QR
9. **RF09**: O sistema deve fornecer um quiz educativo sobre doação de sangue
10. **RF10**: O sistema deve exibir as regras para doação de sangue (requisitos e impedimentos)

**Requisitos Não Funcionais do DoaCin:**

1. **RNF01 - Segurança**: As senhas dos usuários devem ser armazenadas com hash bcrypt (cost factor de 12)
2. **RNF02 - Segurança**: O sistema deve utilizar autenticação JWT com tokens de sessão
3. **RNF03 - Performance**: O tempo de carregamento do dashboard deve ser inferior a 3 segundos
4. **RNF04 - Usabilidade**: A interface deve ser responsiva e funcionar em dispositivos móveis
5. **RNF05 - Confiabilidade**: O sistema deve validar todos os dados de entrada antes de processar
6. **RNF06 - Disponibilidade**: O banco de dados deve utilizar PostgreSQL para garantir integridade transacional
7. **RNF07 - Manutenibilidade**: O código deve seguir padrões de arquitetura em camadas (separação frontend/backend)
8. **RNF08 - Portabilidade**: O sistema deve ser executado em containers Docker
9. **RNF09 - Escalabilidade**: A API REST deve permitir múltiplos clientes simultâneos através de CORS
10. **RNF10 - Interoperabilidade**: O sistema deve integrar com a API externa "Conecta Recife" para dados de pontos de coleta

---

### 1.2 Gerência de Software: Lei de Brooks

#### O que é a Lei de Brooks?

A **Lei de Brooks** foi enunciada por Frederick Brooks no livro "The Mythical Man-Month" (1975) e afirma:

> **"Adicionar pessoas a um projeto de software atrasado o torna mais atrasado ainda."**

#### Explicação Detalhada

Esta lei contraintuitiva ocorre porque:

1. **Overhead de Comunicação**: Quando novos membros são adicionados, o número de canais de comunicação cresce exponencialmente. Para uma equipe de n pessoas, existem n(n-1)/2 canais de comunicação possíveis.

   | Tamanho da Equipe | Canais de Comunicação |
   |-------------------|----------------------|
   | 3 pessoas | 3 canais |
   | 5 pessoas | 10 canais |
   | 10 pessoas | 45 canais |
   | 20 pessoas | 190 canais |

2. **Tempo de Ramp-up**: Novos desenvolvedores precisam de tempo para:
   - Entender a arquitetura do sistema
   - Aprender as convenções do código
   - Conhecer os requisitos do negócio
   - Configurar o ambiente de desenvolvimento

3. **Particionabilidade Limitada**: Nem todas as tarefas podem ser divididas eficientemente. Algumas tarefas são inerentemente sequenciais.

4. **Custo de Treinamento**: Membros experientes precisam parar suas atividades para treinar os novos, reduzindo a produtividade geral temporariamente.

#### Relação com o DoaCin

No contexto do DoaCin, a Lei de Brooks pode ser observada em situações como:

- **Complexidade de Onboarding**: Um novo desenvolvedor precisaria entender:
  - A arquitetura monolítica do projeto
  - A estrutura do banco de dados Prisma
  - A integração com a API externa Conecta Recife
  - O sistema de autenticação JWT
  - As regras de negócio específicas (cálculo de cooldown, pontuação, etc.)

- **Interdependências**: Funcionalidades como dashboard, doações e campanhas estão interligadas. Adicionar pessoas para trabalhar em paralelo pode gerar conflitos de código e necessidade de sincronização constante.

---

### 1.3 Dificuldades Acidentais vs Essenciais (Frederick Brooks)

#### Conceitos

**Dificuldades Essenciais** são inerentes à natureza do software:
- Complexidade dos requisitos
- Conformidade com regras de negócio
- Mudança constante de requisitos
- Invisibilidade do software (não é tangível)

**Dificuldades Acidentais** estão relacionadas às ferramentas e tecnologias usadas:
- Problemas com IDEs, compiladores, frameworks
- Bugs em bibliotecas de terceiros
- Configurações inadequadas de ambiente
- Limitações de sistemas operacionais

#### Exemplo de Dificuldade Acidental no DoaCin

**Problema: Incompatibilidade de Versões do Prisma**

Durante o desenvolvimento do DoaCin, uma dificuldade acidental que poderia ter sido enfrentada:

**Descrição do Problema:**
```
Error: @prisma/client did not initialize yet. 
Please run "prisma generate" and try to import it again.
```

**Causa Raiz:**
- O Prisma Client precisa ser regenerado após cada alteração no `schema.prisma`
- A versão do `@prisma/client` (6.18.0) precisa estar sincronizada com a versão do `prisma` CLI (6.18.0)
- Em ambientes com múltiplos desenvolvedores, cada um precisa rodar `npx prisma generate` localmente

**Por que é uma Dificuldade Acidental:**
- Não tem relação com a complexidade do problema de negócio (gerenciar doações de sangue)
- É puramente uma questão de ferramenta/configuração
- Pode ser resolvida com melhor documentação ou automação (scripts de setup)

**Solução Aplicada:**
1. Documentação clara no [README.md](README.md) com os comandos necessários:
   ```bash
   npm install
   npx prisma migrate deploy
   npx prisma generate
   ```
2. Uso de `nodemon` que reinicia o servidor automaticamente ao detectar mudanças

**Outros Exemplos de Dificuldades Acidentais no DoaCin:**

1. **Configuração do Docker Compose**: Problemas com portas já em uso (3000, 5432) ou volumes não montados corretamente
2. **CORS no Express**: Erro de "blocked by CORS policy" ao fazer requisições do frontend Vite para o backend Express
3. **Variáveis de Ambiente**: Esquecimento de criar o arquivo `.env` com `DATABASE_URL` e `JWT_SECRET`, causando falhas em tempo de execução
4. **Compatibilidade React 19**: Possíveis warnings de APIs deprecated ao usar a versão mais recente do React

---

## Capítulo 2: Processos

### 2.1 Processos Waterfall vs Processos Ágeis

#### Modelo Waterfall (Cascata)

**Características:**
- Processo sequencial e linear
- Cada fase deve ser completada antes da próxima começar
- Forte ênfase em documentação
- Mudanças são difíceis e custosas após o início

**Fases do Waterfall:**
1. **Requisitos**: Levantamento completo e documentação
2. **Design**: Arquitetura e design detalhado
3. **Implementação**: Codificação do sistema
4. **Verificação**: Testes e validação
5. **Manutenção**: Correções e atualizações

**Vantagens:**
- Estrutura clara e disciplinada
- Fácil de gerenciar (marcos bem definidos)
- Ideal para projetos com requisitos estáveis

**Desvantagens:**
- Pouca flexibilidade a mudanças
- Cliente só vê o produto no final
- Alto risco se requisitos forem mal compreendidos

#### Processos Ágeis

**Características:**
- Desenvolvimento iterativo e incremental
- Entregas frequentes de software funcional
- Colaboração contínua com stakeholders
- Adaptação rápida a mudanças

**Valores do Manifesto Ágil:**
1. Indivíduos e interações > processos e ferramentas
2. Software funcionando > documentação abrangente
3. Colaboração com cliente > negociação de contratos
4. Responder a mudanças > seguir um plano

**Vantagens:**
- Flexibilidade para mudanças
- Feedback contínuo do cliente
- Entregas incrementais de valor
- Redução de riscos

**Desvantagens:**
- Pode ser difícil prever prazos e custos
- Requer comprometimento constante do cliente
- Menos documentação formal

#### Tabela Comparativa

| Aspecto | Waterfall | Ágil |
|---------|-----------|------|
| **Abordagem** | Linear e sequencial | Iterativa e incremental |
| **Flexibilidade** | Baixa (mudanças são caras) | Alta (mudanças são esperadas) |
| **Entrega** | Uma entrega final | Entregas frequentes (sprints) |
| **Documentação** | Extensa e detalhada | Suficiente e evolutiva |
| **Cliente** | Envolvido no início e fim | Envolvido continuamente |
| **Riscos** | Identificados tarde | Identificados cedo |
| **Testes** | Fase específica no final | Contínuos durante desenvolvimento |
| **Planejamento** | Todo feito no início | Adaptativo a cada iteração |
| **Equipe** | Especializada por fase | Multifuncional |
| **Adequado para** | Requisitos estáveis, projetos grandes | Requisitos mutáveis, inovação |

#### Contexto do DoaCin

O **DoaCin provavelmente foi desenvolvido usando uma abordagem Ágil**, evidenciado por:

1. **Entregas Incrementais**: As funcionalidades foram implementadas progressivamente (autenticação → dashboard → doações → campanhas → quiz)
2. **Tecnologias Modernas**: Uso de ferramentas que favorecem desenvolvimento ágil (React, Vite, hot reload)
3. **Estrutura Evolutiva**: O schema do Prisma mostra evolução (comentários "NOVO" em campos adicionados posteriormente)
4. **Ambiente Acadêmico**: Projetos acadêmicos geralmente seguem sprints curtos e entregas iterativas

---

### 2.2 Classificação de Sistemas de Software

#### Tipos de Sistemas de Software

Sistemas de software podem ser classificados de diversas formas. Uma classificação comum considera:

1. **Sistemas Stand-alone**
   - Executam em um único computador
   - Não requerem conexão de rede
   - Exemplos: editores de texto, jogos offline

2. **Sistemas Interativos Baseados em Transações**
   - Executam em servidores remotos
   - Usuários acessam via web/mobile
   - Processam requisições e retornam respostas
   - Exemplos: e-commerce, sistemas bancários

3. **Sistemas Embarcados**
   - Integrados a hardware específico
   - Controlam dispositivos físicos
   - Exemplos: sistemas automotivos, IoT

4. **Sistemas de Processamento em Lote**
   - Processam grandes volumes de dados
   - Executam sem interação direta do usuário
   - Exemplos: folha de pagamento, relatórios

5. **Sistemas de Entretenimento**
   - Foco em experiência do usuário
   - Exemplos: jogos, streaming

6. **Sistemas de Coleta de Dados**
   - Coletam dados de sensores/dispositivos
   - Processam e armazenam informações
   - Exemplos: sistemas meteorológicos

7. **Sistemas de Modelagem e Simulação**
   - Modelam processos do mundo real
   - Exemplos: simuladores de voo, CAD

#### Classificação do DoaCin

O **DoaCin** é classificado como um **Sistema Interativo Baseado em Transações** (também chamado de Sistema Web Transacional ou Aplicação Web CRUD).

**Justificativa:**

| Característica | Evidência no DoaCin |
|----------------|---------------------|
| **Arquitetura Cliente-Servidor** | Frontend React (cliente) + Backend Express (servidor) |
| **Baseado em Requisições HTTP** | API REST com endpoints como `/api/auth/login`, `/api/dashboard` |
| **Transacional** | Operações CRUD no banco de dados PostgreSQL via Prisma |
| **Acesso Remoto** | Usuários acessam via navegador web |
| **Estado Persistente** | Dados armazenados em banco relacional |
| **Multi-usuário** | Múltiplos doadores podem usar simultaneamente |
| **Interativo** | Interface responsiva com feedback imediato |

**Sub-classificações Adicionais:**

- **Sistema de Informação Gerencial**: Gerencia dados de doadores, doações e campanhas
- **Sistema de Engajamento Social**: Gamificação (Capibas) e educação (Quiz)
- **Sistema SPA (Single Page Application)**: Frontend React com navegação client-side
- **Sistema de Integração**: Consome API externa (Conecta Recife)

---

### 2.3 Scrum: Método Ágil

#### O que é Scrum?

**Scrum** é um framework ágil para gerenciamento de projetos complexos. Ele divide o trabalho em ciclos chamados **Sprints**, promovendo inspeção e adaptação contínuas.

#### Pilares do Scrum

1. **Transparência**: Todos os aspectos do processo devem ser visíveis aos responsáveis
2. **Inspeção**: Artefatos e progresso devem ser inspecionados frequentemente
3. **Adaptação**: Ajustes devem ser feitos quando desvios são detectados

#### Papéis no Scrum

| Papel | Responsabilidades |
|-------|-------------------|
| **Product Owner (PO)** | Define prioridades, gerencia o Backlog do Produto, representa stakeholders |
| **Scrum Master** | Facilita o processo, remove impedimentos, protege a equipe de interferências |
| **Time de Desenvolvimento** | Desenvolvedores multifuncionais que entregam incrementos de produto |

#### Artefatos do Scrum

##### 1. **Backlog do Produto (Product Backlog)**

**Definição**: Lista ordenada e dinâmica de tudo que é necessário no produto. É a única fonte de requisitos.

**Características:**
- Ordenado por prioridade/valor
- Nunca está completo (evolui constantemente)
- Itens mais prioritários são mais detalhados
- Gerenciado pelo Product Owner

**Exemplo no DoaCin:**

```markdown
BACKLOG DO PRODUTO - DoaCin (ordenado por prioridade)

1. [Alta] Sistema de autenticação (login/registro)
   - Valor: Sem isso, nenhuma funcionalidade personalizada funciona
   - Estimativa: 13 pontos

2. [Alta] Dashboard do doador
   - Valor: Visão geral essencial para o usuário
   - Estimativa: 8 pontos

3. [Alta] Histórico de doações
   - Valor: Transparência e controle para o doador
   - Estimativa: 5 pontos

4. [Média] Mapa de campanhas/locais
   - Valor: Facilita encontrar onde doar
   - Estimativa: 13 pontos

5. [Média] Sistema de pontos (Capibas)
   - Valor: Gamificação para engajamento
   - Estimativa: 8 pontos

6. [Média] Quiz educativo
   - Valor: Educação sobre doação de sangue
   - Estimativa: 13 pontos

7. [Baixa] Integração com Conecta Recife API
   - Valor: Dados reais de pontos de coleta
   - Estimativa: 8 pontos

8. [Baixa] Validação por QR Code
   - Valor: Reduz fraudes, mas requer infraestrutura
   - Estimativa: 21 pontos
```

##### 2. **Sprint**

**Definição**: Período de tempo fixo (geralmente 1-4 semanas) durante o qual um incremento de produto "Pronto" e potencialmente entregável é criado.

**Características:**
- Time-boxed (duração fixa)
- Objetivo claro (Sprint Goal)
- Sem mudanças que afetem o objetivo
- Scope pode ser renegociado com o PO

**Exemplo de Sprint no DoaCin:**

```
SPRINT 3 - DoaCin (2 semanas: 01/11 - 14/11/2024)

Sprint Goal: "Permitir que doadores visualizem seu histórico e acompanhem pontos"

Duração: 2 semanas (10 dias úteis)
Capacidade da equipe: 30 story points
```

##### 3. **Planejamento da Sprint (Sprint Planning)**

**Definição**: Reunião no início da Sprint onde o time decide o que será feito e como.

**Estrutura:**
- **Parte 1 (O quê?)**: Seleção de itens do Backlog do Produto
- **Parte 2 (Como?)**: Planejamento técnico e decomposição em tarefas

**Exemplo no DoaCin:**

```markdown
PLANEJAMENTO DA SPRINT 3 - DoaCin

DATA: 01/11/2024
DURAÇÃO: 4 horas
PARTICIPANTES: PO, Scrum Master, Time Dev (3 pessoas)

PARTE 1 - O QUÊ? (2h)
Sprint Goal: "Permitir que doadores visualizem seu histórico e acompanhem pontos"

Itens Selecionados do Product Backlog:
✓ US-05: Histórico de doações (5 pts)
✓ US-06: Sistema de pontos Capibas (8 pts)
✓ US-07: Cooldown até próxima doação (5 pts)
Total: 18 pontos (dentro da capacidade de 30 pts)

PARTE 2 - COMO? (2h)
Decomposição em Tarefas Técnicas:

US-05: Histórico de doações (5 pts)
- Criar modelo Donation no Prisma ✓
- Endpoint GET /api/donations ✓
- Componente DonationHistoryItem.jsx ✓
- Integração com backend ✓

US-06: Sistema de pontos Capibas (8 pts)
- Adicionar campo pointsEarned em Donation ✓
- Lógica de cálculo de pontos no backend ✓
- Agregação de pontos no dashboard ✓
- Exibir saldo no frontend ✓

US-07: Cooldown até próxima doação (5 pts)
- Lógica de cálculo baseada em gênero ✓
- Endpoint retornar daysUntilNextDonation ✓
- Componente DonationCooldown.jsx ✓
- Testes da lógica ✓

Definition of Done:
- Código revisado (code review)
- Testes manuais realizados
- Documentação atualizada
- Merge na branch main
```

##### 4. **Backlog da Sprint (Sprint Backlog)**

**Definição**: Conjunto de itens do Backlog do Produto selecionados para a Sprint, mais o plano para entregá-los.

**Características:**
- Pertence ao Time de Desenvolvimento
- Pode ser ajustado durante a Sprint
- Visível para todos (quadro Kanban)

**Exemplo no DoaCin (formato Kanban):**

```markdown
SPRINT BACKLOG - Sprint 3

| TO DO | IN PROGRESS | CODE REVIEW | DONE |
|-------|-------------|-------------|------|
| - Lógica cooldown | - DonationHistoryItem.jsx | - Modelo Donation | - Endpoint /api/donations |
| - Componente DonationCooldown.jsx | - Cálculo pontos backend | | - Agregação pontos dashboard |
| | | | - Exibir saldo frontend |
```

##### 5. **Sprint Review**

**Definição**: Reunião no final da Sprint para inspecionar o incremento e adaptar o Backlog do Produto.

**Características:**
- Demonstração do que foi concluído
- Feedback dos stakeholders
- Discussão sobre o que fazer a seguir
- Time-boxed (máximo 4h para Sprint de 1 mês)

**Exemplo no DoaCin:**

```markdown
SPRINT REVIEW - Sprint 3

DATA: 14/11/2024
DURAÇÃO: 2 horas
PARTICIPANTES: PO, Time Dev, Stakeholders (professor, colegas de turma)

AGENDA:

1. Revisão do Sprint Goal (10 min)
   ✓ Goal alcançado: "Permitir que doadores visualizem histórico e pontos"

2. Demonstração das Funcionalidades (60 min)
   
   DEMO 1: Histórico de Doações
   - Login como usuário teste
   - Navegação para página /doacoes
   - Mostrar lista de doações com status (confirmado, pendente)
   - Filtros por data e local
   
   DEMO 2: Sistema de Pontos (Capibas)
   - Dashboard exibindo saldo de Capibas
   - Componente StatCard mostrando pontos ganhos
   - Lógica: 10 pontos por doação confirmada
   
   DEMO 3: Cooldown até Próxima Doação
   - Dashboard mostrando dias restantes
   - Diferentes para homens (60 dias) e mulheres (90 dias)
   - Indicador visual de progresso

3. Feedback dos Stakeholders (40 min)
   
   Professor:
   - "Excelente! Sugestão: adicionar gráfico de histórico mensal"
   
   Colega 1:
   - "Legal o sistema de pontos. E se pudesse resgatar prêmios?"
   
   Colega 2:
   - "Cooldown está claro. Poderia mostrar o percentual também?"

4. Atualização do Product Backlog (10 min)
   - Adicionar: Gráfico de histórico mensal (Prioridade Média)
   - Adicionar: Sistema de recompensas (Prioridade Baixa)
   - Adicionar: Percentual no cooldown (Prioridade Baixa)

MÉTRICAS:
- Planejado: 18 pontos
- Entregue: 18 pontos
- Velocity: 18 pontos/sprint
```

#### Outros Eventos do Scrum

**Daily Scrum (Reunião Diária):**
- 15 minutos, mesmo horário/local
- Time de Desenvolvimento sincroniza atividades
- Três perguntas: O que fiz ontem? O que farei hoje? Há impedimentos?

**Sprint Retrospective:**
- Após a Sprint Review
- Time inspeciona a si mesmo
- Cria plano de melhorias para a próxima Sprint

#### Como Scrum Foi (Possivelmente) Usado no DoaCin

Com base na estrutura do projeto, podemos inferir:

**Evidências de Uso do Scrum:**

1. **Entregas Incrementais**: Funcionalidades foram construídas progressivamente
   - Sprint 1: Estrutura base + Autenticação
   - Sprint 2: Dashboard + Configuração de dados
   - Sprint 3: Histórico de doações + Pontos
   - Sprint 4: Campanhas + Mapa
   - Sprint 5: Quiz + Regras

2. **Backlog Evolutivo**: O `schema.prisma` mostra campos marcados com "NOVO", indicando evolução iterativa dos requisitos

3. **Priorização por Valor**: Funcionalidades core foram implementadas primeiro (autenticação, dashboard) antes de features secundárias (quiz)

4. **Timeboxing**: Provavelmente sprints de 2 semanas alinhadas com ciclo acadêmico

5. **Colaboração**: Múltiplos desenvolvedores trabalhando (evidenciado por commits no Git)

---

### 2.4 User Stories e Story Points

#### User Stories

**Definição**: Uma User Story é uma descrição curta e simples de uma funcionalidade contada da perspectiva do usuário final.

**Formato Padrão:**
```
Como um [tipo de usuário],
Eu quero [realizar alguma ação],
Para que [obter algum benefício/valor].
```

**Características:**
- Escrita em linguagem natural
- Foca no valor para o usuário
- Independente (INVEST criteria)
- Estimável e testável

#### Story Points

**Definição**: Unidade de medida abstrata para expressar a estimativa de esforço necessário para implementar uma User Story.

**Características:**
- Considera: complexidade, esforço, incerteza
- Relativa, não absoluta (comparação entre stories)
- Geralmente usa sequência de Fibonacci (1, 2, 3, 5, 8, 13, 21...)

**Escala de Referência:**

| Story Points | Complexidade | Descrição |
|--------------|--------------|-----------|
| 1-2 | Trivial | Mudança simples, sem incertezas |
| 3-5 | Pequena | Funcionalidade simples, path bem definido |
| 8-13 | Média | Múltiplas camadas, alguma incerteza |
| 21+ | Grande | Complexa, muita incerteza (deve ser quebrada) |

#### Exemplos de User Stories do DoaCin

**US-01: Registro de Usuário**
```
Como um novo doador,
Eu quero criar uma conta no sistema,
Para que eu possa acessar as funcionalidades personalizadas de doação.

Critérios de Aceitação:
- Formulário solicita: CPF, nome, email, senha
- Email e CPF devem ser únicos no sistema
- Senha deve ser armazenada com hash seguro
- Mensagem de sucesso após registro
- Redirecionamento automático para login

Story Points: 5
```

**US-02: Login de Usuário**
```
Como um doador registrado,
Eu quero fazer login no sistema,
Para que eu possa acessar minha conta e visualizar minhas informações.

Critérios de Aceitação:
- Formulário solicita: email e senha
- Validação de credenciais no backend
- Geração de token JWT em caso de sucesso
- Armazenamento seguro do token no frontend
- Mensagem de erro para credenciais inválidas
- Redirecionamento para dashboard após login

Story Points: 3
```

**US-03: Visualizar Dashboard**
```
Como um doador autenticado,
Eu quero visualizar um painel com minhas estatísticas,
Para que eu possa acompanhar meu progresso e status de doação.

Critérios de Aceitação:
- Exibir saldo de Capibas (pontos)
- Mostrar última data de doação
- Calcular e exibir dias até próxima doação permitida
- Mostrar total de doações no último ano
- Cards visuais para cada métrica
- Dados carregados do backend via API

Story Points: 8
```

**US-04: Histórico de Doações**
```
Como um doador,
Eu quero visualizar o histórico completo das minhas doações,
Para que eu possa verificar o status e detalhes de cada doação realizada.

Critérios de Aceitação:
- Lista todas as doações do usuário
- Exibe: data, local, status (confirmado/pendente/rejeitado)
- Ordenação por data (mais recente primeiro)
- Design responsivo (cards ou tabela)
- Indicador visual para cada status

Story Points: 5
```

**US-05: Mapa de Campanhas**
```
Como um doador,
Eu quero visualizar um mapa com locais de coleta próximos,
Para que eu possa encontrar facilmente onde doar sangue.

Critérios de Aceitação:
- Mapa interativo usando Leaflet
- Marcadores para cada ponto de coleta
- Popup com informações ao clicar (nome, endereço, horário)
- Filtros: locais fixos vs eventos temporários
- Integração com API Conecta Recife para dados reais
- Link para Google Maps para navegação

Story Points: 13
```

**US-06: Quiz Educativo**
```
Como um doador,
Eu quero participar de um quiz sobre doação de sangue,
Para que eu possa aprender mais sobre o tema de forma divertida.

Critérios de Aceitação:
- Perguntas de múltipla escolha
- Feedback imediato (correto/incorreto)
- Pontuação ao final
- Design interativo e atraente
- Mínimo de 10 perguntas
- Opção de refazer o quiz

Story Points: 8
```

**US-07: Validação por QR Code**
```
Como um ponto de coleta,
Eu quero validar doações através de QR Code,
Para que o sistema registre automaticamente a doação confirmada.

Critérios de Aceitação:
- Geração de QR Code único por doação
- Scanner de QR Code (câmera ou upload)
- Verificação de autenticidade no backend
- Atualização automática do status para "confirmado"
- Adição de pontos (Capibas) ao doador
- Notificação de confirmação ao doador

Story Points: 21 (Epic - deve ser quebrado em stories menores)
```

#### Técnica de Estimativa: Planning Poker

No Scrum, as User Stories são estimadas pela equipe usando técnicas colaborativas como **Planning Poker**:

1. Product Owner lê a User Story
2. Esclarecimentos são feitos
3. Cada membro escolhe um card (1, 2, 3, 5, 8, 13, 21) secretamente
4. Todos revelam simultaneamente
5. Discutem diferenças significativas
6. Repetem até consenso

**Velocity (Velocidade)**: Média de story points completados por sprint. Exemplo: Se o DoaCin completou 18, 22, 20 pontos nas últimas 3 sprints, a velocity média é 20 pontos/sprint.

---

## Resumo dos Capítulos 1 e 2

### Capítulo 1: Introdução
✓ Requisitos Funcionais vs Não Funcionais compreendidos e exemplificados no DoaCin
✓ Lei de Brooks explicada com contexto de gerenciamento de equipe
✓ Dificuldades Acidentais identificadas (Prisma, Docker, CORS)

### Capítulo 2: Processos
✓ Waterfall vs Ágil comparados em tabela detalhada
✓ DoaCin classificado como Sistema Interativo Baseado em Transações
✓ Scrum explicado com todos os artefatos e eventos
✓ User Stories do DoaCin criadas com Story Points

**Total de User Stories Exemplificadas**: 7
**Range de Story Points**: 3 a 21 pontos
**Evidências de Metodologia Ágil no DoaCin**: Múltiplas

---

*Documento gerado em: 14 de dezembro de 2025*
*Projeto: DoaCin - Sistema de Gerenciamento de Doação de Sangue*
*Curso: Engenharia de Software*
