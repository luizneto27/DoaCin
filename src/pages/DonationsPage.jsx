import React, { useState, useEffect } from 'react';
import DonationHistoryItem from '../components/DonationHistoryItem'; 
import { authFetch } from '../../services/api';

function DonationsPage() {
  //inicializa com estado vazio
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    setLoading(true);
    // 
    authFetch('/api/donations', { method: 'GET' }) //a autenticação deve lidar com o token

    .then(res => {
      if (!res.ok) {
        throw new Error('Falha na autenticação ou erro no servidor');
      }
      return res.json()
    })

    .then(data => {
      setDonations(data);
      setLoading(false);
    })

    .catch(err => {
      console.error("Erro ao buscar doações:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <div>
      {/* Aqui podem entrar os StatCards (Total de doações, etc.) */}
      
      {/* Critério 2: Seção "Histórico" */}
      <div className="history-section" style={{ marginTop: '20px' }}>
        <h2 style={{ textAlign: 'left' }}>Histórico de Doações</h2>
        {donations.length > 0 ? (
          donations.map(donation => (
            <DonationHistoryItem
              key={donation.id}
              date={new Date(donation.donationDate).toLocaleDateString('pt-BR')}
              location={donation.location.name}
              status={donation.status}
              points={donation.pointsEarned}
            />
          ))
        ) : (
          <p>Você ainda não possui um histórico de doações.</p>
        )}
      </div>
    </div>
  );
}

export default DonationsPage;