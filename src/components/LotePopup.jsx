import React from 'react';
import './LotePopUp.css';

export default function LotePopUp({ lotId, tier, reserved, reservedDisplayName, onClose, onReservar }) {
  const tierMap = {
    oro: { label: 'Oro', price: '1000 U$D', color: '#c1a441' },
    plata: { label: 'Plata', price: '600 U$D', color: '#b2b2b2' },
    bronce: { label: 'Bronce', price: '300 U$D', color: '#a17952' },
  };

  const isAnonymous = reserved && (
    reservedDisplayName?.toLowerCase() === 'anónimo' ||
    reservedDisplayName?.toLowerCase() === 'anonimo'
  );

  return (
    <div className="popup">
      <button className="close-btn" onClick={onClose}>×</button>

      {reserved ? (
        isAnonymous ? (
          <>
            <h3>¡Reservado!</h3>
            <p>Gracias por contribuir a este sueño.</p>
          </>
        ) : (
          <>
            <h3>¡Reservado!</h3>
            <p>Gracias Flia/s.<br />{reservedDisplayName}</p>
          </>
        )
      ) : (
        <>
          <h3>
            Lote {lotId}{' '}
            <span style={{ color: tierMap[tier].color, fontWeight: 'bold' }}>
              {tierMap[tier].label}
            </span>
          </h3>
          <p>{tierMap[tier].price}</p>
          <button
            className="reservar-btn"
            style={{ backgroundColor: tierMap[tier].color }}
            onClick={onReservar}
          >
            Reservar
          </button>
        </>
      )}
    </div>
  );
}
