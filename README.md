# 🩸 DoaCIn

## Pra rodar (por enquanto) 

 Execute o dockerdesktop no seu pc (baixe, se for preciso)

* `docker-compose up -d`
* `npm install`
* `npm install -D tsx` 
* `npx prisma migrate deploy`
* `npx prisma generate`
* `npx prisma db seed`
* `npm run dev`
* Pra usar o prisma studio, split o terminal e rode `npx prisma studio`

## Funcionalidades Principais

* **Painel do Doador:** Visualização do saldo de Capibas e acompanhamento do período para a próxima doação.

* **Histórico de Doações:** Exibe todas as doações com status( confirmada, pendente) e local.

* **Campanhas:** Exibe locais de doação fixos ou itenerários próximos ao doador.

* **Quiz:** Um quiz educativo e desafiador para testar as mentes curiosas.

* **Regras para Doação de Sangue:** Exibe os requisitos básicos, impedimentos temporários e impedimentos definitivos.

## 🏛️ Estrutura do Projeto

O projeto segue uma arquitetura unificada, onde o frontend (React) e o backend (Express) coexistem no mesmo diretório raiz.

### Frontend (`src/`)

O frontend é uma aplicação de página única (SPA) construída com **React** e **Vite**. A estrutura de pastas é:

* `src/pages/`: Contém os componentes de nível superior que são mapeados para as rotas. Cada arquivo aqui representa uma "tela" da aplicação (ex: `HomePage.jsx`, `DonationsPage.jsx`).
* `src/components/`: Armazena componentes React reutilizáveis que são usados em múltiplas páginas (ex: `StatCard.jsx`, `DonationHistoryItem.jsx`).
* `src/layout/`: Componentes responsáveis pela estrutura visual da aplicação, como `MainLayout.jsx`, que renderiza a navegação lateral e utiliza o `<Outlet />` do React Router para exibir a página ativa.
* `src/services/`: Camada de abstração da API. Centraliza a lógica de comunicação (`fetch`) com o backend (ex: `authService.js`, `donationsService.js`).
* `src/App.jsx`: Ponto de entrada do React onde o `BrowserRouter` e as rotas da aplicação são configurados.

### Backend (Pastas `routes/` e `server.js`)

O backend é uma API RESTful construída com **Node.js** e **Express**. A arquitetura segue o padrão de Route-Controller.

* `server.js`: Ponto de entrada do servidor Express. Ele inicializa a instância do Express, aplica middlewares globais (como `cors()` e `express.json()`) e monta os módulos de rotas principais (ex: `/api/auth`, `/api/dashboard`).
* `routes/`: Contém os arquivos que definem os endpoints (URLs) da API.
    * `routes/auth.js`: Define as rotas públicas de autenticação, como `POST /api/auth/login` e `POST /api/auth/register`.
    * `routes/dashboard.js`: Define as rotas relacionadas aos dados do painel, como `GET /api/dashboard`.
    * `routes/donations.js`: Define as rotas para o histórico de doações.
* `routes/controllers/`: Contém a lógica de negócio (handler functions) desacoplada das definições de rota.
    * `authController.js`: Contém as funções `login` e `register` que lidam com a lógica de autenticação.
    * `dashboardController.js`: Contém a função `getDashboardStats` que busca os dados no banco.
* `routes/controllers/middleware/`: Contém funções de middleware que processam requisições antes de chegarem aos controladores.
    * `auth.js`: Este é o **middleware de autenticação JWT**. Ele é injetado nas rotas protegidas (como em `dashboard.js`) para verificar o `Authorization` header, validar o token e anexar os dados do usuário (`req.userData`) à requisição, ou retornar um erro 401 se a autenticação falhar.

### Banco de Dados (`prisma/`)

* `prisma/schema.prisma`: Arquivo de definição do **Prisma ORM**. Descreve os modelos de dados (tabelas) como `User`, `Donation` e `Location`, suas colunas e os relacionamentos entre eles.
