import React, { useState, useEffect } from 'react';
import DonationHistoryItem from '../components/DonationHistoryItem'; 

// MOCK DATA
const mockDonations = [
  {
    id: '1',
    donationDate: '2023-10-01T10:00:00Z',
    location: { name: 'Hemope Recife' },
    status: 'confirmed',
    pointsEarned: 100
  },
  {
    id: '2',
    donationDate: '2023-08-15T14:30:00Z',
    location: { name: 'Praça do Derby (Evento)' },
    status: 'confirmed',
    pointsEarned: 20
  },
  {
    id: '3',
    donationDate: '2023-11-01T09:00:00Z',
    location: { name: 'Hospital das Clínicas' },
    status: 'pending',
    pointsEarned: 0
  }
];

function DonationsPage() {
  // Inicializa o estado com os dados falsos
  const [donations, setDonations] = useState(mockDonations);
  const [loading, setLoading] = useState(false); // Não precisamos carregar

  /*
  // O useEffect e o fetch ficarão comentados
  useEffect(() => {
    setLoading(true);
    fetch('/api/donations') // Chamada real
    .then(res => res.json())
    .then(data => {
      setDonations(data);
      setLoading(false);
    })
    .catch(err => setLoading(false));
  }, []);
  */

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