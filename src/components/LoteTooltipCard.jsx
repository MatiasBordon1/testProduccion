import './LoteTooltipCard.css';

export default function LoteTooltipCard({
  lotId,
  tier,
  reserved,
  reservedDisplayName,
  onClose,
  onReservar,
}) {
  const isAnonimo = reservedDisplayName === "Anónimo";
  const showReserved = reserved;

  // 🔹 Precio dinámico según tier
  const precios = {
    oro: 1000,
    plata: 600,
    bronce: 300,
  };
  const precio = precios[tier] || 300;

  return (
    <div className="tooltip-card-wrapper">
      <div className="tooltip-card">
        {/* ====== Header (Lote + Tier + Cerrar) ====== */}
        <div className="tooltip-header">
          <div className="lote-info">
            <span className="lot-id">Lote {lotId}</span>
            <span className={`tier ${tier}`}>{tier}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* ====== Contenido ====== */}
        {!showReserved ? (
          <>
            <div className="tooltip-price">{precio}</div>
            <button
              className={`tooltip-button ${tier}`}
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
                : `Gracias Flia/Flias\n${reservedDisplayName}`}
            </div>
          </>
        )}
      </div>

      {/* Flechita visual */}
      <div
        className={`tooltip-arrow ${showReserved ? "reserved" : tier}`}
      ></div>
    </div>
  );
}
