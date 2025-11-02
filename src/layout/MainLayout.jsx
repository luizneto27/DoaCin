//Este componente renderizará a barra lateral esquerda fixa e a área de conteúdo principal onde as páginas serão exibidas.

// Barra Lateral:
// ○ Receberá dados do AuthContext (nome do usuário, email).
// ○ Buscará os dados do "Suas Conquistas" (total de doações, vidas salvas) e "Saldo
// Capibas" de um endpoint (ex: GET /api/user/stats) ou do endpoint GET /api/user/me.
// ○ Usará NavLink do react-router-dom para a navegação.
// ○ Terá uma função de "Sair" (logout) que limpa o AuthContext e o localStorage