import React from 'react';
import './LoteInfoSidebar.css';

const TIER_INFO = {
  oro:    { label: 'Oro',    color: '#beab47', price: 1000 },
  plata:  { label: 'Plata',  color: '#d9d7ce', price: 600  },
  bronce: { label: 'Bronce', color: '#ad956c', price: 300  },
};

export default function LoteInfoSidebar({
  lotId,
  tier = 'bronce',
  reserved = false,
  reservedDisplayName = '',
  onReservar,
  onClose,
}) {
  if (!lotId) return null;

  const info = TIER_INFO[tier] || TIER_INFO.bronce;

  return (
    <div className="loteinfo-container">
      <button className="loteinfo-close" onClick={onClose}>×</button>

      {!reserved ? (
        <>
          <h2>Lote {lotId} <strong>{info.label}</strong></h2>
          <p className="loteinfo-price">{info.price} USD</p>

          <button
            className="loteinfo-cta"
            style={{
              background: info.color,
              color: tier === 'plata' ? '#000' : '#fff',
            }}
            onClick={onReservar}
          >
            Reservar
          </button>
        </>
      ) : (
        <>
          <h2>¡Reservado!</h2>
          <p className="loteinfo-thanks">
            Gracias {reservedDisplayName || 'por contribuir a este sueño.'}
          </p>
        </>
      )}
    </div>
  );
}
