import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import './LotePreview.css';

const TIER_INFO = {
  oro:    { label: 'Oro',    color: '#beab47', price: 1000 },
  plata:  { label: 'Plata',  color: '#d9d7ce', price: 600  },
  bronce: { label: 'Bronce', color: '#ad956c', price: 300  },
};

export default function LotePreview({
  position = [0, 0.2, 0],
  loteId,
  tier = 'bronce',
  reserved = false,
  reservedDisplayName = '',
  onClose,
  onReservar,
  isTopView = false,
}) {
  const info = TIER_INFO[tier] || TIER_INFO.bronce;
  const groupRef = useRef();

  // ❌ Ocultar pop-up en vista superior
  if (isTopView) return null;

  // ✅ Seguir rotación de la cancha cuando hay rotación automática
  useFrame(() => {
    if (groupRef.current && groupRef.current.parent?.rotation) {
      groupRef.current.rotation.copy(groupRef.current.parent.rotation);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        transform
        distanceFactor={10}
        wrapperClass="lotepreview-html"
        zIndexRange={[0, 0]}
      >
        <div className="lotepreview-card">
          <button className="lotepreview-close" onClick={onClose} aria-label="Cerrar">×</button>

          {!reserved ? (
            <>
              <div className="lotepreview-title">
                Lote {loteId} <strong>{info.label}</strong>
              </div>
              <div className="lotepreview-price">{info.price} USD</div>

              <button
                className="lotepreview-cta"
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
              <div className="lotepreview-reserved"><strong>¡Reservado!</strong></div>
              <div className="lotepreview-thanks">
                Gracias {reservedDisplayName || 'por contribuir a este sueño.'}
              </div>
            </>
          )}
        </div>
      </Html>
    </group>
  );
}
