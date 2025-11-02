// ● Componentes: StatCard (Capibas, Doações, Vidas Salvas), InfoBox (Intervalo, Duração,
// Recompensa), RecentActivityItem.
// ● Lógica de Dados:
// ○ Fará uma chamada para GET /api/dashboard.
// ○ Lógica de Cooldown: O backend deve calcular a data da próxima doação. (Ex:
// dataUltimaDoacao + 60 dias). O frontend exibirá a contagem regressiva.
// ○ Lógica de Gamificação:
// ■ "Vidas Salvas": totalDoacoesConfirmadas * 4 (assumindo que 1 doação salva 4
// vidas).
// ■ "Capibas": Pontos ganhos por doações confirmadas.
//Atividades Recentes: É uma lista das 2-3 últimas doações (o mesmo componente da pág. "Minhas Doações").