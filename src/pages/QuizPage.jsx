// ● Tela Inicial (Screenshot 6): Página estática com as regras do quiz. O botão "Começar
// Quiz" navegaria para a primeira pergunta (ex: /quiz/1).
// ● Lógica do Quiz (Não mostrado, mas inferido):
// ○ Você precisará de uma nova rota, ex: /quiz/play.
// ○ GET /api/quiz/:id para buscar as perguntas.
// ○ Gerenciar o estado da pergunta atual, respostas selecionadas.
// ○ Ao finalizar, POST /api/quiz/submit e exibir uma tela de resultados

// Conteúdo para: src/pages/QuizPage.jsx

import React from 'react';

function QuizPage() {
  return (
    <div>
      <h1>Página do Quiz</h1>
      <p>(Esta é uma página de placeholder).</p>
    </div>
  );
}

export default QuizPage;