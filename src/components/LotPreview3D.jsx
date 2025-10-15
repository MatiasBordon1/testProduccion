import React, { useRef } from 'react';
import { Html } from '@react-three/drei';

const tierMap = {
  oro: { label: 'Oro', price: '1000 U$D', color: '#c1a441' },
  plata: { label: 'Plata', price: '600 U$D', color: '#b2b2b2' },
  bronce: { label: 'Bronce', price: '300 U$D', color: '#a17952' },
};

export default function LotPreview3D({
  position = [0, 1.8, 0],
  lotId,
  tier,
  reserved,
  reservedDisplayName,
  onClose,
  onReservar,
}) {
  const ref = useRef();

  const isAnonymous = reserved && (
    reservedDisplayName?.toLowerCase() === 'anónimo' ||
    reservedDisplayName?.toLowerCase() === 'anonimo'
  );

  return (
    <Html
      position={position}
      center
      occlude
      transform
      distanceFactor={15}
      zIndexRange={[100, 0]}
    >
      <div
        ref={ref}
        style={{
          background: 'white',
          padding: '18px 22px',
          borderRadius: '14px',
          minWidth: '220px',
          maxWidth: '280px',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 10,
            border: 'none',
            background: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#aaa',
          }}
        >
          ×
        </button>

        {reserved ? (
          isAnonymous ? (
            <>
              <h3 style={{ marginBottom: 8 }}>¡Reservado!</h3>
              <p>Gracias por contribuir a este sueño.</p>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: 8 }}>¡Reservado!</h3>
              <p>Gracias Flia/s.<br />{reservedDisplayName}</p>
            </>
          )
        ) : (
          <>
            <h3 style={{ marginBottom: 8 }}>
              Lote {lotId}{' '}
              <span style={{ color: tierMap[tier].color }}>
                {tierMap[tier].label}
              </span>
            </h3>
            <p style={{ marginBottom: 12 }}>{tierMap[tier].price}</p>
            <button
              onClick={onReservar}
              style={{
                backgroundColor: tierMap[tier].color,
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                fontSize: '15px',
                padding: '10px 20px',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              Reservar
            </button>
          </>
        )}
      </div>
    </Html>
  );
}
