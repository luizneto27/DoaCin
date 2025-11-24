import React from 'react';

/**
 * Componente interno para renderizar um item da lista de regras.
 * Ele usa um ícone (SVG) e o texto.
 */
const RuleItem = ({ text, iconType = 'check' }) => {
  const icons = {
    check: (
      <svg style={styles.iconCheck} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    block: (
       <svg style={styles.iconBlock} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <li style={styles.listItem}>
      {icons[iconType]}
      <span style={styles.listText}>{text}</span>
    </li>
  );
};

/**
 * Componente interno para renderizar uma seção (cartão) de regras.
 */
const RuleSection = ({ title, icon, children, titleColor }) => {
  return (
    <div style={styles.sectionCard}>
      <h2 style={{...styles.sectionTitle, color: titleColor}}>
        {icon}
        {title}
      </h2>
      <ul style={styles.list}>
        {children}
      </ul>
    </div>
  );
};

// --- Ícones SVG para os Títulos das Seções ---
const IconCheckCircle = () => (
  <svg style={styles.titleIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconBlockCircle = () => (
  <svg style={styles.titleIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);


// --- Página Principal de Regras ---

function RulesPage() {
  // Conteúdo extraído das capturas de tela
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
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Regras para Doação de Sangue</h1>
      <p style={styles.subHeader}>
        Conheça os principais requisitos para ser um doador.
      </p>

      {/* Seção: Requisitos Básicos */}
      <RuleSection 
        title="Requisitos Básicos (Quem pode doar)" 
        icon={<IconCheckCircle />}
        titleColor="#16a34a" // Verde
      >
        {requisitosBasicos.map((rule, index) => (
          <RuleItem key={index} text={rule} iconType="check" />
        ))}
      </RuleSection>

      {/* Seção: Impedimentos Temporários */}
      <RuleSection 
        title="Impedimentos Temporários" 
        icon={<IconBlockCircle />}
        titleColor="#ef4444" // Vermelho
      >
        {impedimentosTemporarios.map((rule, index) => (
          <RuleItem key={index} text={rule} iconType="block" />
        ))}
      </RuleSection>

      {/* Seção: Impedimentos Definitivos */}
       <RuleSection 
        title="Impedimentos Definitivos" 
        icon={<IconBlockCircle />}
        titleColor="#ef4444" // Vermelho
      >
        {impedimentosDefinitivos.map((rule, index) => (
          <RuleItem key={index} text={rule} iconType="block" />
        ))}
      </RuleSection>

    </div>
  );
}

// Estilos CSS-in-JS para o componente
const styles = {
  pageContainer: {
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    color: '#374151', // Tom de cinza mais escuro
    background: '#f9fafb', // Fundo levemente acinzentado
    boxSizing: 'border-box', // Garante que o padding não aumente a largura total
  },
  header: {
    fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', // Texto responsivo 
    color: '#ef4444', // Vermelho
    textAlign: 'left',
    marginBottom: '8px',
  },
  subHeader: {
    fontSize: '1.125rem', // 18px
    color: '#374151', 
    textAlign: 'left',
    marginBottom: '32px',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    marginBottom: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.25rem', // 20px
    fontWeight: '600',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    margin: 0,
  },
  titleIcon: {
    width: '24px',
    height: '24px',
    marginRight: '12px',
  },
  list: {
    padding: '16px 24px',
    margin: 0,
    listStyle: 'none',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem', // 16px
    color: '#374151',
    padding: '8px 0',
  },
  listText: {
    marginLeft: '12px',
    lineHeight: '1.5',
  },
  iconCheck: {
    width: '20px',
    height: '20px',
    color: '#16a34a', // Verde
    flexShrink: 0,
  },
  iconBlock: {
    width: '20px',
    height: '20px',
    color: '#ef4444', // Vermelho
    flexShrink: 0,
  },
};

export default RulesPage;