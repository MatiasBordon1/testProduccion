import React from "react";
import "./LoteMobileOverlay.css";

export default function LoteMobileOverlay({
  preview,
  onClose,
  onReservar,
}) {
  const { id, tier, reserved, displayName } = preview || {};
  const isAnonimo = displayName === "Anónimo";

  // 🔹 Precios según tier
  const precios = {
    oro: 1000,
    plata: 600,
    bronce: 300,
  };
  const precio = precios[tier] || 300;

  return (
    <div className="mobile-overlay-backdrop">
      <div className="mobile-overlay-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {!reserved ? (
          <>
            <div className="lot-title">Lote {id}</div>
            <div className={`tier-tag ${tier}`}>{tier}</div>
            <div className="lot-price">
              {precio} USD
            </div>
            <button
              className={`buy-btn ${tier}`}
              onClick={onReservar}
            >
              Comprar
            </button>
          </>
        ) : (
          <>
            <div className="reserved-title">¡Reservado!</div>
            <div className="reserved-text">
              {isAnonimo
                ? "Gracias por contribuir a este sueño."
                : `Gracias Flia/Flias\n${displayName}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
