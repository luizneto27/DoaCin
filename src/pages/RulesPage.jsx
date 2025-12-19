import React from 'react';
import './RulesPage.css';

/**
 * Componente interno para renderizar um item da lista de regras.
 * Ele usa um ícone (SVG) e o texto.
 */
const RuleItem = ({ text, iconType = 'check' }) => {
  const icons = {
    check: (
      <svg className="rules-icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    block: (
       <svg className="rules-icon-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <li className="rules-list-item">
      {icons[iconType]}
      <span className="rules-list-text">{text}</span>
    </li>
  );
};

/**
 * Componente interno para renderizar uma seção (cartão) de regras.
 */
const RuleSection = ({ title, icon, children, titleColorClass }) => {
  return (
    <div className="rules-section-card">
      <h2 className={`rules-section-title ${titleColorClass}`}>
        {icon}
        {title}
      </h2>
      <ul className="rules-list">
        {children}
      </ul>
    </div>
  );
};

// Ícones SVG para os títulos das seções
const IconCheckCircle = () => (
  <svg className="rules-title-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconBlockCircle = () => (
  <svg className="rules-title-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);


// Página de regras para doação de sangue

function RulesPage() {
  const requisitosBasicos = [
    "Apresentar documento de identificação com foto, emitido por órgão oficial.",
    "Ter entre 16 e 69 anos. (Menores de 18 anos precisam de autorização).",
    "Pesar no mínimo 50 kg.",
    "Estar em boas condições de saúde.",
    "Ter dormido pelo menos 6 horas nas últimas 24 horas.",
    "Estar alimentado, evitando alimentos gordurosos 3 horas antes da doação."
  ];

  const impedimentosTemporarios = [
    "Estar gripado, resfriado ou com febre.",
    "Tatuagem ou maquiagem definitiva nos últimos 12 meses.",
    "Ter ingerido bebida alcoólica nas 12 horas que antecedem a doação.",
    "Gravidez ou amamentação (se o parto ocorreu há menos de 12 meses).",
    "Ter feito extração dentária ou tratamento de canal nos últimos 7 dias."
  ];

  const impedimentosDefinitivos = [
    "Ter tido hepatite após os 11 anos de idade.",
    "Ter contraído malária.",
    "Evidência clínica ou laboratorial de doenças como Hepatites B e C, AIDS, ou doenças associadas ao vírus HTLV I e II.",
    "Uso de drogas ilícitas injetáveis."
  ];

  return (
    <div className="rules-page">
      <h1 className="rules-page-header">Regras para Doação de Sangue</h1>
      <p className="rules-page-subheader">
        Conheça os principais requisitos para ser um doador.
      </p>

      {/* Seção: Requisitos Básicos */}
      <RuleSection 
        title="Requisitos Básicos (Quem pode doar)" 
        icon={<IconCheckCircle />}
        titleColorClass="green"
      >
        {requisitosBasicos.map((rule, index) => (
          <RuleItem key={index} text={rule} iconType="check" />
        ))}
      </RuleSection>

      {/* Seção: Impedimentos Temporários */}
      <RuleSection 
        title="Impedimentos Temporários" 
        icon={<IconBlockCircle />}
        titleColorClass="red"
      >
        {impedimentosTemporarios.map((rule, index) => (
          <RuleItem key={index} text={rule} iconType="block" />
        ))}
      </RuleSection>

      {/* Seção: Impedimentos Definitivos */}
       <RuleSection 
        title="Impedimentos Definitivos" 
        icon={<IconBlockCircle />}
        titleColorClass="red"
      >
        {impedimentosDefinitivos.map((rule, index) => (
          <RuleItem key={index} text={rule} iconType="block" />
        ))}
      </RuleSection>

    </div>
  );
}

export default RulesPage;