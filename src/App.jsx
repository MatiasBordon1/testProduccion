// src/App.jsx
import React, { useEffect, useState } from 'react';
import Cancha3D from './components/Cancha3D';
import UIControls from './components/UIControls';
import PopupReserva from './components/PopupReserva';
import './App.css';
import ThankYouPopup from './components/ThankYouPopup';
import { oroLotes, plataLotes } from './models/lote';
import useIsMobile from './hooks/useIsMobile';
import { appendReservation } from './api/client'; // ✅ nuevo import
import fondo from './assets/fondo/trama_2_sist_web_opacidad.svg';

function App() {
  const isMobile = useIsMobile();
  const [showLotes, setShowLotes] = useState(false);
  const [topView, setTopView] = useState(false);
  const [activeTiers, setActiveTiers] = useState({ oro: false, plata: false, bronce: false });
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [reservedLots, setReservedLots] = useState([]);
  const [reservedDetails, setReservedDetails] = useState({});
  const [thankYou, setThankYou] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  const totalLotCount = 100;

  // Nueva API interna (Vercel)
  const API_BASE = import.meta.env.VITE_API_BASE || '/api';

  // Forzar vista superior en móvil
  useEffect(() => {
    if (isMobile) {
      setTopView(true);
      setAutoRotate(false);
    }
  }, [isMobile]);

  // Cargar reservas existentes desde backend
  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const res = await fetch(`${API_BASE}/reservations`);
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Error en backend');

        // Adaptar a tu estructura de reserva
        const filas = data.rows.slice(1); // salta encabezados
        const lotes = [];
        const detalles = {};

        filas.forEach((r) => {
          const [timestamp, lote, nombre, correo, telefono, mostrarComo] = r;
          if (lote) {
            lotes.push(lote);
            detalles[lote] = {
              lote,
              firstName: nombre,
              email: correo,
              phone: telefono,
              displayName: mostrarComo,
              anonymous: mostrarComo === 'Anónimo',
              timestamp,
            };
          }
        });

        setReservedLots(lotes);
        setReservedDetails(detalles);
      } catch (err) {
        console.error('Error al obtener lotes reservados:', err);
      }
    };
    obtenerReservas();
  }, []);

  // Selección desde la cancha
  const handleSelectLot = (lotId) => setSelectedLot(lotId);

  // Guardar nueva reserva (llamando a backend)
  const handleReserve = async (lotId, formData) => {
    if (reservedLots.includes(lotId)) {
      alert('Lote ya reservado');
      return;
    }

    try {
      await appendReservation(lotId, formData); // ✅ nueva función backend

      setReservedLots((prev) => [...prev, lotId]);
      setReservedDetails((prev) => ({
        ...prev,
        [lotId]: {
          ...formData,
          displayName: formData.anonymous ? 'Anónimo' : formData.displayName,
        },
      }));

      setSelectedLot(null);

      let tier = 'bronce';
      if (oroLotes.includes(lotId)) tier = 'oro';
      else if (plataLotes.includes(lotId)) tier = 'plata';
      setThankYou({ lotId, tier });
    } catch (err) {
      console.error('Error guardando reserva:', err);
      alert('Error al guardar la reserva, intenta nuevamente.');
    }
  };

  const toggleTier = (tier) =>
    setActiveTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));

  const activarTodos = () => {
    const allActive = activeTiers.oro && activeTiers.plata && activeTiers.bronce;
    setActiveTiers(
      allActive
        ? { oro: false, plata: false, bronce: false }
        : { oro: true, plata: true, bronce: true }
    );
  };

  const benefitTexts = {
    oro: '15% de descuento en cuota social durante todo 2026.',
    plata: '10% de descuento en cuota social durante todo 2026.',
    bronce: '5% de descuento en cuota social durante todo 2026.',
  };

  // Zoom
  const handleZoomIn = () =>
    window.dispatchEvent(new CustomEvent('app-zoom', { detail: { dir: 'in' } }));
  const handleZoomOut = () =>
    window.dispatchEvent(new CustomEvent('app-zoom', { detail: { dir: 'out' } }));

  return (
    <div className="app-container">
      <div className="background-layer"></div>
      <div className="content-layer">
        <UIControls
          showLotes={showLotes}
          setShowLotes={setShowLotes}
          topView={topView}
          setTopView={setTopView}
          activeTiers={activeTiers}
          onSelectTier={toggleTier}
          onSelectTodos={activarTodos}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          selectedLot={selectedLot}
          onClearSelection={() => setSelectedLot(null)}
          totalLots={totalLotCount}
          reservedCount={reservedLots.length}
          benefitTexts={benefitTexts}
          setContactOpen={setContactOpen}
        />

        <div className="cancha-wrapper">
          {isMobile && !selectedLot && (
            <img
              className="mobile-corner-logo"
              src="/assets/cancha/logo-nuevo-idra.png"
              alt="IDRA"
              width={44}
              height={44}
            />
          )}

          <div className="zoom-buttons">
            <button onClick={handleZoomIn} aria-label="Acercar">+</button>
            <button onClick={handleZoomOut} aria-label="Alejar">−</button>
          </div>

          <Cancha3D
            showLotes={showLotes}
            topView={topView}
            activeTiers={activeTiers}
            autoRotate={autoRotate}
            onSelectLot={handleSelectLot}
            reservedLots={reservedLots}
            reservedDetails={reservedDetails}
            selectedLot={selectedLot}
            contactOpen={contactOpen}
          />
        </div>

        <PopupReserva
          selectedLot={selectedLot}
          onReserve={handleReserve}
          reservedLots={reservedLots}
          onClose={() => setSelectedLot(null)}
          reservation={selectedLot ? reservedDetails[selectedLot] : null}
        />

        {thankYou && (
          <ThankYouPopup
            lotId={thankYou.lotId}
            tier={thankYou.tier}
            onClose={() => setThankYou(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
