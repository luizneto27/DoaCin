//  Componentes: StatCard, DonationHistoryItem.
// ● Lógica de Dados:
// ○ Chamada para GET /api/donations/stats para os cards do topo.
// ○ Chamada para GET /api/donations para preencher o "Histórico de Doações".
// ○ Renderização condicional para os status "Confirmada" (verde) e "Pendente"
// (laranja).
// ○ Modal "+ Nova Doação": Um formulário simples onde o usuário seleciona o local e a
// data, enviando um POST /api/donations (com status 'pending').