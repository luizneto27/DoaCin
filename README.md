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

---

## 💡 Slide 2: A Solução - DoaCin

### Uma Plataforma para Engajar e Facilitar a Doação

✅ **Gamificação**: Sistema de pontos para incentivar doações   
✅ **Informação**: Educação sobre requisitos e elegibilidade  
✅ **Localização**: Mapa de hemocentros e campanhas  
✅ **Acompanhamento**: Histórico de Doações e controle das próximas 
✅ **Validação Digital**: QR Code para confirmar doações e ganhar recompensas

**Objetivo**: Aumentar a frequência e regularidade das doações de sangue

---

## 🎯 Slide 3: Funcionalidades Principais

### 1. 📊 Painel do Doador (Dashboard)
- Visualização do saldo de **Capibas**
- Cálculo automático do período de cooldown para próxima doação
- Estatísticas: doações realizadas, vidas salvas, doações pendentes
- Informações do doador: tipo sanguíneo, última doação

### 2. 🩸 Gestão de Doações
- **Registro de novas doações** com data e local
- **Histórico completo** com status (confirmada/pendente)
- **QR Code pessoal** para validação no hemocentro
- Confirmação automática ao escanear o QR Code

### 3. 🗺️ Campanhas e Localização
- **Mapa de Campanhas** locais de doação em Recife
- Filtros por tipo: **Fixos** (hemocentros) e **Eventos** (campanhas temporárias)
- Informações detalhadas: endereço, horário, telefone
- Navegação direta para agendamento de doação

---

## 🎮 Slide 4: Funcionalidades de Engajamento

### 4. 🧠 Quiz Educativo
- Perguntas sobre doação de sangue
- **Explicações educativas** após cada resposta
- Incentiva o aprendizado sobre o processo de doação

### 5. 📋 Regras de Elegibilidade
- **Requisitos básicos**: idade, peso, condições de saúde
- **Impedimentos temporários**: gripe, tatuagem recente, medicamentos
- **Impedimentos definitivos**: doenças transmissíveis

### 6. 👤 Perfil do Usuário
- Gestão de dados pessoais

---

## ⚙️ Slide 5: Arquitetura Técnica

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
- 🔧 **Prisma ORM** 

**DevOps:**
- 🐳 **Docker Compose** - Containerização do banco
- 📦 **npm** - Gerenciamento de dependências

---

## 🙏 Slide 6: Obrigado!

### 🩸 DoaCin - Doe sangue, salve vidas

**Uma doação pode salvar até 4 vidas. DoaCin multiplica esse impacto! 🩸**
