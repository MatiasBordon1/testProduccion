// src/components/ThankYouPopup.jsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import './ThankYouPopup.css';

export default function ThankYouPopup({ lotId, tier = 'bronce', onClose }) {
  if (!lotId) return null;
  const tierClass = (tier || '').toLowerCase();

  useEffect(() => {
    const colors = ['#F68C4E', '#2E5F93'];

    // Duración total más larga
    const duration = 4500; // ms
    const end = Date.now() + duration;

    // 1) Dos ráfagas grandes desde los costados
    const bigBurst = (x) =>
      confetti({
        particleCount: 180,
        startVelocity: 55,
        spread: 80,
        ticks: 200,
        gravity: 0.7,
        origin: { x, y: 0.25 },
        colors,
        scalar: 1.1,
      });
    bigBurst(0.12);
    bigBurst(0.88);

    // 2) “Llovizna” continua desde arriba (requestAnimationFrame para suavidad)
    let rafId;
    const drizzle = () => {
      confetti({
        particleCount: 10,
        angle: 90,
        spread: 70,
        startVelocity: 40,
        ticks: 220,
        gravity: 0.6,
        origin: { x: 0.5 + (Math.random() - 0.5) * 0.2, y: 0 }, // arriba, centrado +/- 10%
        colors,
        scalar: 1,
      });
      if (Date.now() < end) {
        rafId = requestAnimationFrame(drizzle);
      }
    };
    rafId = requestAnimationFrame(drizzle);

    // 3) Mini cañones laterales periódicos mientras dure el festejo
    const sideCannons = setInterval(() => {
      const left = Math.random() < 0.5;
      confetti({
        particleCount: 16,
        spread: 75,
        startVelocity: 45,
        ticks: 220,
        gravity: 0.65,
        origin: { x: left ? 0.08 : 0.92, y: 0.18 + Math.random() * 0.2 },
        colors,
        scalar: 1.05,
      });
      if (Date.now() > end) clearInterval(sideCannons);
    }, 180);

    // Limpieza
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearInterval(sideCannons);
    };
  }, []);

  return (
    <div className="thankyou-popup" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="thankyou-overlay" />
      <div className="thankyou-content" onClick={(e) => e.stopPropagation()}>

        

        {/* Franja 100% ancho dentro del popup */}
        <div className={`thankyou-band ${tierClass}`}>🧡💙¡GRACIAS!💙🧡</div>

        <p className="thankyou-subtitle"><strong>¡Un paso más para crecer en equipo!</strong></p>
        <p className="thankyou-lot">Tu reserva del lote {String(lotId)} nos acerca a la cancha propia, un sueño de toda la familia IDRA.</p>
        <p className="thankyou-footer"><strong>Nos comunicaremos pronto con vos.</strong></p>



        <button className="thankyou-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
