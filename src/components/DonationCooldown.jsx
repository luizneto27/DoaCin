import React from 'react';
import { Link } from 'react-router-dom';

// Helper para adicionar dias a uma data
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper para calcular idade
function getAge(birthDateString) {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// --- Componente Principal ---
function DonationCooldown({ 
  lastDonationDate, 
  genero, 
  donationCountLastYear,
  birthDate,
  weight
}) {
  
  // 0. Verifica se o perfil está completo
  const age = getAge(birthDate);
  const isWeightOk = weight != null && weight >= 50;
  const isGenderSet = genero === 'M' || genero === 'F';

  if (!isWeightOk || !birthDate || !isGenderSet) {
    return (
       <div style={styles.card}>
        <h3>Complete seu Perfil</h3>
        <p style={styles.messageWarning}>
          Para calcular sua elegibilidade para doação, precisamos que você
          complete seu perfil com <strong>data de nascimento, peso e gênero</strong>.
        </p>
        <Link to="/perfil" style={styles.button}>
          Atualizar Perfil
        </Link>
      </div>
    )
  }

  // 1. Verifica regras de elegibilidade (idade, peso)
  const isMale = (genero === 'M');
  const minAge = isMale ? 18 : 16;

  if (age < minAge || age > 69) {
     return (
       <div style={styles.card}>
        <h3>Elegibilidade</h3>
        <p style={styles.messageWarning}>
          A idade para doação é de <strong>{minAge} a 69 anos</strong>.
          Atualmente, você está fora dessa faixa etária.
        </p>
      </div>
    );
  }
  
  // 2. Caso: Sem doações (Novo usuário elegível)
  if (!lastDonationDate) {
    return (
      <div style={styles.card}>
        <h3>Bem-vindo(a), Doador(a)!</h3>
        <p style={styles.message}>
          Você já pode fazer sua primeira doação! Encontre o hemocentro mais próximo.
        </p>
        <Link to="/campanhas" style={styles.button}>
          Ver locais de doação
        </Link>
      </div>
    );
  }

  // 3. Define as regras de intervalo para quem já doou
  const intervalDays = isMale ? 60 : 90;
  const maxDonationsPerYear = isMale ? 4 : 3;
  const today = new Date();
  const lastDonation = new Date(lastDonationDate);

  // 4. Calcula a próxima data de doação (baseada no intervalo)
  const nextDonationByInterval = addDays(lastDonation, intervalDays);

  // 5. Verifica as condições
  const isAnnualLimitReached = donationCountLastYear >= maxDonationsPerYear;
  const isIntervalMet = today >= nextDonationByInterval;

  // 6. Renderiza a lógica
  const lastDonationString = lastDonation.toLocaleDateString('pt-BR');

  if (isAnnualLimitReached) {
    return (
      <div style={styles.card}>
        <h3>Acompanhe sua Doação</h3>
        <p>Última doação: {lastDonationString}</p>
        <p style={styles.messageWarning}>
          Parabéns! Você atingiu o limite de {maxDonationsPerYear} doações anuais.
          Você poderá doar novamente quando sua primeira doação deste ciclo completar um ano.
        </p>
      </div>
    );
  }

  if (isIntervalMet) {
    // Pode doar
    return (
      <div style={styles.card}>
        <h3>Pronto para Doar Novamente!</h3>
        <p>Sua última doação foi em: {lastDonationString}.</p>
        <p style={styles.message}>
          O intervalo de {intervalDays} dias já passou. Você já pode salvar vidas de novo!
        </p>
        <Link to="/campanhas" style={styles.button}>
          Agendar nova doação
        </Link>
      </div>
    );
  } else {
    // Ainda em cooldown
    const nextDonationString = nextDonationByInterval.toLocaleDateString('pt-BR');
    return (
      <div style={styles.card}>
        <h3>Acompanhe sua Doação</h3>
        <p>Última doação: {lastDonationString}</p>
        <p style={styles.messageWarning}>
          Obrigado por doar! O intervalo para {isMale ? 'homens' : 'mulheres'} é de {intervalDays} dias.
        </p>
        <p>
          <strong>
            Você pode doar novamente a partir de: {nextDonationString}
          </strong>
        </p>
      </div>
    );
  }
}

// Estilos simples para o card (seguindo o padrão dos outros componentes)
const styles = {
  card: {
    marginTop: '20px',
    textAlign: 'left',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  },
  message: {
    color: '#16a34a', // verde
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
  messageWarning: {
    color: '#d97706', // ambar
    fontWeight: 'bold',
  },
  button: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: 'rgba(235, 14, 14, 0.87)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  }
};

export default DonationCooldown;