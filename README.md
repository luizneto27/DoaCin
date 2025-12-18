# 🩸 DoaCIn

## Como Rodar o programa:

* Execute o dockerdesktop no seu pc (baixe, se for preciso)
* `docker-compose up -d`
* `npm install`
* `npm install -D tsx` 
* `npx prisma migrate deploy`
* `npx prisma generate`
* `npx prisma db seed`
* `npm run dev`
* Pra usar o prisma studio, split o terminal e rode `npx prisma studio`

# 🩸 DoaCin - Apresentação do Projeto

---

## 📋 Slide 1: O Problema

### A Doação de Sangue no Brasil

**Desafios Identificados:**

- 📉 **Baixa adesão contínua**: Muitos doadores doam apenas uma vez
- ❓ **Falta de informação**: Desconhecimento sobre requisitos e elegibilidade
- 🗺️ **Dificuldade de localização**: Doadores não sabem onde doar próximo a eles
- 📊 **Ausência de acompanhamento**: Não há um registro pessoal e gamificado das doações
- ⏰ **Esquecimento dos prazos**: Doadores não lembram quando podem doar novamente

**Impacto:**
- Estoques de sangue frequentemente baixos nos hemocentros
- Uma única doação pode salvar até **4 vidas**

---

## 💡 Slide 2: A Solução - DoaCin

### Uma Plataforma para Engajar e Facilitar a Doação

**DoaCin** é uma aplicação web que transforma a experiência de doação de sangue através de:

✅ **Gamificação**: Sistema de pontos (Capibas) para incentivar doações regulares  
✅ **Informação**: Educação sobre requisitos e elegibilidade  
✅ **Localização**: Mapa interativo de hemocentros e campanhas  
✅ **Acompanhamento**: Controle pessoal do histórico e próximas doações  
✅ **Validação Digital**: QR Code para confirmar doações e ganhar recompensas

**Objetivo**: Aumentar a frequência e regularidade das doações de sangue

---

## 🎯 Slide 3: Funcionalidades Principais

### 1. 📊 Painel do Doador (Dashboard)
- Visualização do saldo de **Capibas** (100 por doação confirmada)
- Cálculo automático do período de cooldown para próxima doação
- Estatísticas: doações realizadas, vidas salvas, doações pendentes
- Informações do doador: tipo sanguíneo, última doação

### 2. 🩸 Gestão de Doações
- **Registro de novas doações** com data e local
- **Histórico completo** com status (confirmada/pendente)
- **QR Code pessoal** para validação no hemocentro
- Confirmação automática ao escanear o QR Code

### 3. 🗺️ Campanhas e Localização
- **Mapa interativo** (Leaflet) com locais de doação em Recife
- Filtros por tipo: **Fixos** (hemocentros) e **Eventos** (campanhas temporárias)
- Informações detalhadas: endereço, horário, telefone
- Navegação direta para agendamento de doação

---

## 🎮 Slide 4: Funcionalidades de Engajamento

### 4. 🧠 Quiz Educativo
- Perguntas sobre doação de sangue
- **Explicações educativas** após cada resposta
- Feedback personalizado baseado no desempenho
- Incentiva o aprendizado sobre o processo de doação

### 5. 📋 Regras de Elegibilidade
- **Requisitos básicos**: idade, peso, condições de saúde
- **Impedimentos temporários**: gripe, tatuagem recente, medicamentos
- **Impedimentos definitivos**: doenças transmissíveis
- Interface clara com código de cores (verde/amarelo/vermelho)

### 6. 👤 Perfil do Usuário
- Gestão de dados pessoais
- Visualização do tipo sanguíneo
- Controle de doações e recompensas

---

## ⚙️ Slide 5: Arquitetura Técnica (Resumo)

### Stack Tecnológico

**Frontend:**
- ⚛️ **React 19** + **Vite** - Interface moderna e responsiva
- 🗺️ **Leaflet/React-Leaflet** - Mapas interativos
- 🎨 **CSS3** - Animações e design customizado

**Backend:**
- 🟢 **Node.js + Express** - API RESTful
- 🔐 **JWT** - Autenticação segura
- 🔒 **bcryptjs** - Hash de senhas

**Banco de Dados:**
- 🗄️ **PostgreSQL** (via Docker)
- 🔧 **Prisma ORM** - Migrations e queries type-safe

**DevOps:**
- 🐳 **Docker Compose** - Containerização do banco
- 📦 **npm** - Gerenciamento de dependências

---

## 🏗️ Slide 6: Padrões de Projeto (Resumo)

### Arquitetura Unificada (Fullstack Monorepo)

```
📁 Estrutura:
├── src/              → Frontend React (SPA)
│   ├── pages/        → Rotas principais
│   ├── components/   → Componentes reutilizáveis
│   └── services/     → Camada de API (authFetch)
├── routes/           → Backend Express (API REST)
│   └── controllers/  → Lógica de negócio
└── prisma/           → Schema e migrations do DB
```

**Padrões Aplicados:**
- ✅ **Route-Controller Pattern** (Backend)
- ✅ **Context API** (Estado global no React)
- ✅ **Protected Routes** (Middleware JWT)
- ✅ **Service Layer** (Abstração de API calls)

---

## 📈 Slide 7: Fluxo do Usuário - Doação Completa

### Jornada do Doador

1. **Login/Cadastro** → Autenticação com JWT
2. **Dashboard** → Visualiza elegibilidade e estatísticas
3. **Campanhas** → Encontra hemocentro mais próximo no mapa
4. **Nova Doação** → Registra agendamento com data e local
5. **QR Code** → Apresenta no hemocentro para validação
6. **Confirmação** → Funcionário escaneia, doação é confirmada
7. **Recompensa** → **+100 Capibas** creditados automaticamente
8. **Cooldown** → Sistema calcula próxima data elegível

**Resultado:** Doador engajado com histórico completo e incentivos para continuar doando

---

## 🎯 Slide 8: Impacto e Diferenciais

### Por que DoaCin se destaca?

**🏆 Diferenciais Competitivos:**
- 🎮 **Gamificação** com sistema de pontos (Capibas)
- 🗺️ **Geolocalização** intuitiva de locais de doação
- 📱 **QR Code** para validação rápida e digital
- 📊 **Dashboard personalizado** com cálculo automático de elegibilidade
- 🧠 **Educação integrada** (Quiz + Regras)

**💪 Impacto Esperado:**
- ⬆️ Aumento na frequência de doações
- 🔄 Maior retenção de doadores regulares
- 📈 Melhoria na gestão de estoque dos hemocentros
- 🌟 Experiência positiva e engajadora

---

## 🚀 Slide 9: Demonstração

### Principais Telas

**1. Dashboard:**
- Saldo de Capibas, próxima doação elegível, vidas salvas

**2. Campanhas:**
- Mapa interativo, filtros, detalhes de locais

**3. Doações:**
- Formulário de registro, histórico com status, QR Code

**4. Quiz:**
- Perguntas educativas com feedback imediato

**5. Regras:**
- Requisitos e impedimentos com código de cores

---

## 💭 Slide 10: Próximos Passos e Melhorias

### Roadmap Futuro

**🔜 Funcionalidades Planejadas:**
- 🔔 **Notificações**: Alertas quando o doador estiver elegível novamente
- 🏪 **Loja de Recompensas**: Trocar Capibas por benefícios reais
- 📱 **App Mobile**: Versão nativa para iOS/Android
- 🤝 **Parcerias**: Integração com redes de hemocentros
- 📊 **Analytics**: Dashboard para gestores de hemocentros
- 🌐 **Expansão**: Suporte a outras cidades além de Recife

**🎯 Meta Final:**
Tornar DoaCin a principal plataforma de engajamento de doadores de sangue no Brasil

---

## 🙏 Slide 11: Obrigado!

### 🩸 DoaCin - Doe sangue, salve vidas, ganhe recompensas

**Repositório:**  
📁 github.com/luizneto27/DoaCin

**Tecnologias:**  
⚛️ React | 🟢 Node.js | 🗄️ PostgreSQL | 🔧 Prisma | 🗺️ Leaflet

**Contato:**  
💬 Dúvidas e sugestões são bem-vindas!

---

### 📊 Estatísticas do Projeto

- **16** páginas/componentes React
- **5** módulos de rotas no backend
- **4** modelos de dados (Prisma)
- **1** objetivo: salvar vidas através da tecnologia

**Uma doação pode salvar até 4 vidas. DoaCin multiplica esse impacto! 🩸**
