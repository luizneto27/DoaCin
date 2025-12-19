import React from 'react';
import { Link } from 'react-router-dom';
import '../animations.css';
import './DonationCooldown.css';

// Funções auxiliares para cálculos de datas

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

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

function daysBetween(date1, date2) {
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInMs = date1.getTime() - date2.getTime();
  return Math.ceil(diffInMs / oneDay);
}


// Componente de detalhes do cooldown (reutilizável)

const CooldownDetails = ({ interval, reward }) => (
  <div className="cooldown-details">
    <div className="detail-item">
      <h4>Intervalo</h4>
      <p>{interval} dias</p>
    </div>
    <div className="detail-item">
      <h4>Duração</h4>
      <p>15-30 min</p>
    </div>
    <div className="detail-item">
      <h4>Recompensa</h4>
      <p>{reward} Capibas</p>
    </div>
  </div>
);


// Componente principal DonationCooldown

function DonationCooldown({ 
  lastDonationDate, 
  genero, 
  donationCountLastYear,
  birthDate,
  weight,
  latestDonation
}) {
  
  // 0. Verifica se o perfil está completo
  const isWeightOk = weight != null && weight >= 50;
  const isGenderSet = genero === 'Masculino' || genero === 'Feminino';
  const isAgeSet = birthDate != null;

  if (!isWeightOk || !isAgeSet || !isGenderSet) {
    return (
       <div className="cooldown-card-new complete-profile">
        <h3>Complete seu Perfil</h3>
        <p className="cooldown-message warning">
          Para calcular sua elegibilidade, precisamos que você
          complete seu perfil com data de nascimento, peso e gênero.
        </p>
        <div className="cooldown-details">
          <div className="detail-item"><h4>Idade</h4><p>{isAgeSet ? 'OK' : 'Pendente'}</p></div>
          <div className="detail-item"><h4>Peso</h4><p>{isWeightOk ? 'OK' : 'Pendente'}</p></div>
          <div className="detail-item"><h4>Gênero</h4><p>{isGenderSet ? 'OK' : 'Pendente'}</p></div>
        </div>
        <Link to="/perfil" className="cooldown-button">
          Atualizar Perfil
        </Link>
      </div>
    );
  }

  // 1. Verifica regras de elegibilidade (idade)
  const age = getAge(birthDate);
  const isMale = (genero === 'M');
  const minAge = 16;
  
  if (age < minAge || age > 69) {
     return (
       <div className="cooldown-card-new complete-profile">
        <h3>Elegibilidade</h3>
        <p className="cooldown-message warning">
          A idade para doação é de <strong>16 a 69 anos</strong>.
          Atualmente, você está fora dessa faixa etária.
        </p>
      </div>
    );
  }
  
  // 2. Define as regras de intervalo
  const intervalDays = isMale ? 60 : 90;
  const maxDonationsPerYear = isMale ? 4 : 3;
  const rewardPoints = 100;
  const today = new Date();

  // 3. Caso: Sem doações (Novo usuário elegível)
  if (!lastDonationDate) {
    return (
      <div className="cooldown-card-new ready">
        <h3>Tudo pronto para doar!</h3>
        <p className="cooldown-message">
          Você já pode fazer sua primeira doação e salvar até 4 vidas!
        </p>
        <CooldownDetails interval={intervalDays} reward={rewardPoints} />
        <Link to="/campanhas" className="cooldown-button">
          Ver locais de doação
        </Link>
      </div>
    );
  }

  // 4. Lógica para quem já doou
  const lastDonation = new Date(lastDonationDate);
  const nextDonationByInterval = addDays(lastDonation, intervalDays);
  const isAnnualLimitReached = donationCountLastYear >= maxDonationsPerYear;
  const isIntervalMet = today >= nextDonationByInterval;

  if (isAnnualLimitReached) {
    return (
      <div className="cooldown-card-new">
        <h3>Limite Anual Atingido</h3>
        <p className="cooldown-message warning">
          Parabéns! Você atingiu o limite de {maxDonationsPerYear} doações anuais.
          Você poderá doar novamente 1 ano após sua primeira doação deste ciclo.
        </p>
        <CooldownDetails interval={intervalDays} reward={rewardPoints} />
        <button className="cooldown-button" disabled>
          Aguarde o período
        </button>
      </div>
    );
  }

  if (isIntervalMet) {
    // Pode doar
    return (
      <div className="cooldown-card-new ready">
        <h3>Pronto para Doar Novamente!</h3>
        <p className="cooldown-message">
          O intervalo de {intervalDays} dias já passou. Você já pode salvar vidas de novo!
        </p>
        <CooldownDetails interval={intervalDays} reward={rewardPoints} />
        <Link to="/campanhas" className="cooldown-button">
          Agendar nova doação
        </Link>
      </div>
    );
  } 
  
  // 5. Caso: Em Cooldown (Estado da imagem)
  const daysRemaining = daysBetween(nextDonationByInterval, today);
  const daysText = daysRemaining === 1 ? '1 dia' : `${daysRemaining} dias`;

  return (
    <div className="cooldown-card-new">
      <h3>Aguarde um Pouquinho</h3>
      <p className="cooldown-message">
        Você poderá doar novamente em <strong>{daysText}</strong>.
      </p>
      <CooldownDetails interval={intervalDays} reward={rewardPoints} />
      <button className="cooldown-button" disabled>
        Aguarde o período de intervalo
      </button>
    </div>
  );
}

export default DonationCooldown;