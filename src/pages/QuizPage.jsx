// src/pages/QuizPage.jsx

import React, { useState } from 'react';

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

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  function startQuiz() {
    setShowIntro(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowInfo(false);
    setShowResults(false);
  }

  function handleSelect(answer) {
    if (selectedAnswer !== null) return; // já respondido
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
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
      <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
        <style>{`
          .intro-card {
            width: 100%;
            max-width: 840px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(16,24,40,0.08);
            overflow: hidden;
            font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          .intro-top {
            background: linear-gradient(180deg,#ef3b36,#d9302b);
            color: white;
            padding: 36px 28px;
            text-align:center;
          }
          .intro-top .icon {
            width:72px; height:72px; border-radius:50%;
            background: rgba(255,255,255,0.12); display:inline-flex;
            align-items:center; justify-content:center; margin-bottom:12px;
          }
          .intro-top h1 { margin:6px 0 6px; font-size:24px; font-weight:800; }
          .intro-top p { margin:0; opacity:0.95; }
          .intro-body { padding:22px 26px; }
          .rules-box {
            background: #fff6f6;
            border: 1px solid rgba(233, 94, 93, 0.08);
            border-radius: 10px;
            padding: 18px;
            margin-bottom: 18px;
          }
          .rules-list { padding:0; margin:0; list-style:none; }
          .rules-list li { display:flex; gap:12px; align-items:flex-start; margin:12px 0; color:#0f172a; }
          .rules-list li .bullet { 
            color: #ef4444; /* MUDANÇA AQUI: Era verde (#16a34a) */
            font-weight:700; 
            flex:0 0 22px; 
          }
          .start-btn {
            width:100%;
            background: linear-gradient(180deg,#ef3b36,#d9302b);
            color:white;
            border:none;
            padding:14px 16px;
            border-radius:8px;
            font-weight:700;
            cursor:pointer;
            box-shadow: 0 6px 18px rgba(233,59,54,0.18);
          }
        `}</style>

        <div className="intro-card" role="region" aria-label="Quiz Capiba - regras">
          <div className="intro-top">
            <div className="icon" aria-hidden>
              {/* simple brain icon using emoji to keep self-contained */}
              <span style={{fontSize:28}}>🧠</span>
            </div>
            <h1>Quiz Capiba</h1>
            <p>Teste seus conhecimentos sobre doação de sangue!</p>
          </div>

          <div className="intro-body">
            <div className="rules-box" aria-hidden>
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
    );
  }

  // Quiz UI (unchanged)
  return (
    <div className="quiz-page" style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <style>{`
        .quiz-container {
          width: 100%;
          max-width: 840px;
          background: #ffffff;
          border-radius: 12px;
          padding: 36px;
          box-shadow: 0 8px 20px rgba(16,24,40,0.08);
          text-align: center;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        .quiz-header {
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom: 16px;
        }
        #question-counter {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          flex: 0 0 auto;
        }
        .progress {
          flex:1;
          display:flex;
          justify-content:center;
        }
        .progress-bar-bg {
          width: 60%;
          background: #f3f4f6;
          height: 8px;
          border-radius: 999px;
        }
        .progress-bar {
          height: 8px;
          background: #e53935;
          border-radius: 999px;
          width: ${progressPercent}%;
          transition: width 300ms ease;
        }
        #question-title {
          font-size: 28px;
          line-height: 1.15;
          font-weight: 800;
          margin: 8px 0 22px;
          color: #0f172a;
        }
        .answer-list { padding:0; margin:0 0 12px 0; }
        .answer-list li { list-style:none; margin: 10px 0; }
        .quiz-btn {
          width:100%;
          text-align:left;
          padding: 18px 20px;
          border-radius: 10px;
          border: 1px solid #e6e6e6;
          background: #fbfbfb;
          font-size: 16px;
          color: #0f172a;
          box-shadow: none;
          transition: box-shadow .12s, transform .06s;
        }
        .quiz-btn:hover { box-shadow: 0 2px 0 rgba(16,24,40,0.04); cursor: pointer; transform: translateY(-1px); }
        .quiz-btn.disabled { pointer-events: none; opacity: 0.98; }
        .quiz-btn.correct { background: #e6f4ea; border: 2px solid #2e7d32; }
        .quiz-btn.incorrect { background: #fdecea; border: 2px solid #c62828; }
        
        .info-box {
          background: #fff6f6;
          border: 1px solid #fee2e2;
          padding: 14px 16px;
          border-radius: 8px;
          color: #0f172a;
          text-align: left;
          margin-top: 18px;
        }
        .info-box strong { font-weight: 700; }
        .quiz-actions { margin-top: 18px; display:flex; }
        .next-btn {
          background: #e53935;
          color: #fff;
          border: none;
          padding: 14px 18px;
          width: 100%;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
        }

        .result-modal {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(15, 23, 42, 0.45);
          z-index: 60;
          padding: 28px;
        }
        .result-card {
          width: 520px;
          max-width: 100%;
          background: #ffffff;
          border-radius: 12px;
          padding: 34px 36px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(2,6,23,0.18);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        .result-medal {
          width:64px; height:64px; margin: -60px auto 12px;
          display:flex; align-items:center; justify-content:center;
          background: linear-gradient(180deg,#fff6f2,#fff);
          border-radius: 999px; box-shadow: 0 6px 18px rgba(233,59,54,0.08);
          font-size:28px;
        }
        .result-card h2 { margin: 6px 0 8px; font-size:24px; font-weight:800; color:#0f172a; }
        .result-card .subtitle { color:#6b7280; margin-bottom:18px; }
        .score-large { font-size:48px; color:#e53935; font-weight:800; margin: 6px 0; }
        .percent { font-weight:700; color:#0f172a; margin-bottom:12px; }
        .feedback { color:#374151; line-height:1.5; margin-bottom:18px; }
        .again-btn {
          display:inline-flex;
          align-items:center;
          gap:10px;
          background: linear-gradient(180deg,#ef3b36,#d9302b);
          color:white;
          border:none;
          padding:12px 18px;
          border-radius:10px;
          font-weight:700;
          cursor:pointer;
          box-shadow: 0 8px 24px rgba(233,59,54,0.16);
        }
        .footer-small { margin-top:12px; color:#ef4444; font-weight:700; display:flex; gap:8px; align-items:center; justify-content:center; }

        @media (max-width: 520px) {
          .result-card { padding: 22px; }
          .score-large { font-size:40px; }
        }
      `}</style>

      <div className={`quiz-container ${showResults ? 'blurred' : ''}`}>
        <div className="quiz-header">
          <div id="question-counter">Pergunta {currentQuestionIndex + 1} de {totalQuestions}</div>
          <div className="progress">
            <div className="progress-bar-bg" aria-hidden>
              <div id="progress-bar" className="progress-bar" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <h2 id="question-title">{currentQuestion.question}</h2>

        <ul id="answer-list" className="answer-list">
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
          <div id="info-box" className="info-box" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
        )}

        <div className="quiz-actions">
          {showInfo && (
            <button id="next-btn" className="next-btn" onClick={handleNext}>
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
            <div id="result-modal" className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
              <div className="result-card">
                <div className="result-medal" aria-hidden>🏅</div>
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

                <div className="footer-small">💗 <span style={{marginLeft:6}}>Doe sangue. Doe vida.</span></div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}

export default QuizPage;