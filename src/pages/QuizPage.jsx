// src/pages/QuizPage.jsx

import React, { useState } from 'react';
import Toast from '../components/Toast';
import './QuizPage.css';

const quizData = [
    {
        question: "Com que frequência um homem pode doar sangue?",
        answers: ["A cada 2 meses", "A cada 6 meses", "Uma vez por ano", "A cada 4 meses"],
        correctAnswer: "A cada 2 meses",
        explanation: "💡 <strong>Você sabia?</strong> Homens podem doar sangue a cada 2 meses (60 dias), até 4 vezes por ano. Mulheres podem doar a cada 3 meses (90 dias), até 3 doações por ano."
    },
    {
        question: "Com que frequência uma mulher pode doar sangue?",
        answers: ["A cada 2 meses", "A cada 3 meses", "A cada 6 meses", "Uma vez por ano"],
        correctAnswer: "A cada 3 meses",
        explanation: "💡 <strong>Você sabia?</strong> O intervalo para mulheres é de 3 meses (90 dias), permitindo até 3 doações por ano. Isso se deve à reposição dos estoques de ferro, que é mais lenta."
    },
    {
        question: "Qual é a faixa de idade geral para ser um doador de sangue no Brasil?",
        answers: ["16 a 69 anos", "18 a 60 anos", "21 a 65 anos", "Apenas maiores de 21"],
        correctAnswer: "16 a 69 anos",
        explanation: "💡 <strong>Você sabia?</strong> É preciso ter entre 16 e 69 anos. Menores (16 e 17 anos) precisam de autorização dos responsáveis. A primeira doação deve ser feita antes dos 60 anos."
    },
    {
        question: "O que é necessário fazer ANTES de doar sangue?",
        answers: ["Estar em jejum total", "Ter dormido pelo menos 6 horas", "Tomar um analgésico", "Beber álcool na noite anterior"],
        correctAnswer: "Ter dormido pelo menos 6 horas",
        explanation: "💡 <strong>Você sabia?</strong> É fundamental estar descansado (mínimo 6h de sono), bem alimentado (evitar gorduras nas 3h anteriores) e hidratado. O jejum total NÃO é recomendado."
    },
    {
        question: "Doar sangue interfere no peso?",
        answers: ["Sim, engorda", "Sim, emagrece", "Não interfere no peso", "Depende do tipo sanguíneo"],
        correctAnswer: "Não interfere no peso",
        explanation: "💡 <strong>Você sabia?</strong> Doar sangue não engorda nem emagrece. O volume de líquido é reposto em 24h e as células em algumas semanas, sem impacto calórico ou no peso."
    }
];

function QuizPage() {
  const totalQuestions = quizData.length;
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  function startQuiz() {
    setShowIntro(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowInfo(false);
    setShowResults(false);
    showToast('Quiz iniciado! Boa sorte! 🎯', 'info');
  }

  function handleSelect(answer) {
    if (selectedAnswer !== null) return; // já respondido
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
      showToast('Resposta correta! Parabéns! 🎉', 'success');
    } else {
      showToast('Resposta incorreta. Veja a explicação abaixo.', 'error');
    }

    setShowInfo(true);
  }

  function handleNext() {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowInfo(false);
    } else {
      // finalizar
      setShowResults(true);
      const percentage = Math.round((score / totalQuestions) * 100);
      if (percentage >= 80) {
        showToast(`Quiz finalizado! Você acertou ${score} de ${totalQuestions}! 🏆`, 'success');
      } else if (percentage >= 60) {
        showToast(`Quiz finalizado! Você acertou ${score} de ${totalQuestions}. Continue estudando! 📚`, 'warning');
      } else {
        showToast(`Quiz finalizado! Você acertou ${score} de ${totalQuestions}. Tente novamente! 💪`, 'info');
      }
    }
  }

  function handleRestart() {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowInfo(false);
    setShowResults(false);
    setShowIntro(true);
  }

  function getButtonClass(answer) {
    if (selectedAnswer === null) return 'quiz-btn';
    if (answer === currentQuestion.correctAnswer) return 'quiz-btn correct disabled';
    if (answer === selectedAnswer && answer !== currentQuestion.correctAnswer) return 'quiz-btn incorrect disabled';
    return 'quiz-btn disabled';
  }

  function getFeedback(percentage) {
    if (percentage >= 80) {
      return {
        title: 'Excelente!',
        text: '👏 Parabéns! Você conhece muito bem o assunto sobre doação de sangue.'
      };
    } else if (percentage >= 50) {
      return {
        title: 'Bom trabalho!',
        text: '💪 Você já sabe bastante, mas ainda há mais a aprender sobre esse gesto tão importante!'
      };
    } else {
      return {
        title: 'Continue aprendendo',
        text: '🙂 Boa tentativa! Aproveite para ler as explicações e aprender mais sobre doação de sangue.'
      };
    }
  }

  // Intro / Rules screen (matches the provided design) rendered before quiz starts
  if (showIntro) {
    return (
      <div className="quiz-page">
        <div className="quiz-intro">
          <div className="intro-card" role="region" aria-label="Quiz Capiba - regras">
            <div className="intro-top">
              <div className="icon" aria-hidden="true">
                <span>🧠</span>
              </div>
              <h1>Quiz Capiba</h1>
              <p>Teste seus conhecimentos sobre doação de sangue!</p>
            </div>

            <div className="intro-body">
              <div className="rules-box" aria-hidden="true">
                <ul className="rules-list">
                  <li><span className="bullet">🏁</span><div><strong>Como Funciona</strong></div></li>
                  <li><span className="bullet">✅</span><div><strong>{totalQuestions} perguntas</strong> sobre doação de sangue</div></li>
                  <li><span className="bullet">✅</span><div>Aprenda informações importantes sobre doação</div></li>
                  <li><span className="bullet">✅</span><div>Cada pergunta tem apenas uma resposta correta</div></li>
                </ul>
              </div>

              <button className="start-btn" onClick={startQuiz} aria-label="Começar Quiz">
                ► Começar Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Quiz UI
  return (
    <div className="quiz-page">
      <div className={`quiz-container ${showResults ? 'blurred' : ''}`}>
        <div className="quiz-header">
          <div className="question-counter">Pergunta {currentQuestionIndex + 1} de {totalQuestions}</div>
          <div className="progress">
            <div className="progress-bar-bg" aria-hidden="true">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <h2 className="question-title">{currentQuestion.question}</h2>

        <ul className="answer-list">
          {currentQuestion.answers.map((ans) => (
            <li key={ans}>
              <button
                type="button"
                className={getButtonClass(ans)}
                onClick={() => handleSelect(ans)}
                dangerouslySetInnerHTML={{ __html: ans }}
              />
            </li>
          ))}
        </ul>

        {showInfo && (
          <div className="info-box" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
        )}

        <div className="quiz-actions">
          {showInfo && (
            <button className="next-btn" onClick={handleNext}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Próxima Pergunta →' : 'Ver Resultado →'}
            </button>
          )}
        </div>
      </div>

      {showResults && (
        (() => {
          const percentage = Math.round((score / totalQuestions) * 100);
          const feedback = getFeedback(percentage);
          return (
            <div className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
              <div className="result-card">
                <div className="result-medal" aria-hidden="true">🏅</div>
                <h2 id="result-title">Quiz Finalizado!</h2>
                <div className="subtitle">Sua pontuação</div>
                <div className="score-large">{score}/{totalQuestions}</div>
                <div className="percent">{percentage}% de acertos</div>
                <div className="feedback">
                  <strong>{feedback.title}</strong><br />
                  {feedback.text}
                </div>

                <button className="again-btn" onClick={handleRestart} aria-label="Fazer Novamente">
                  🔁 Fazer Novamente
                </button>

                <div className="footer-small">💗 <span>Doe sangue. Doe vida.</span></div>
              </div>
            </div>
          );
        })()
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default QuizPage;