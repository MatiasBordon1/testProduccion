import React, { useEffect, useState } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import './UIControls.css';
import ProgressBar from './ProgressBar';
import PopupContacto from './PopupContacto';
import { FaWhatsapp } from 'react-icons/fa';
import { FaStreetView } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";

const logoPath = '/assets/cancha/logo-nuevo-idra.png';

export default function UIControls({
  showLotes,
  setShowLotes,
  topView,
  setTopView,
  activeTiers,
  onSelectTier,
  onSelectTodos,
  autoRotate,
  setAutoRotate,
  selectedLot,
  onClearSelection,
  totalLots = 100,
  reservedCount = 0,
  benefitTexts = {
    oro: 'Beneficios de Oro (placeholder). Cambialo desde App.jsx',
    plata: 'Beneficios de Plata (placeholder). Cambialo desde App.jsx',
    bronce: 'Beneficios de Bronce (placeholder). Cambialo desde App.jsx',
  },
  setContactOpen // 👈 Conecta con App.jsx para avisar a Cancha3D
}) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showContacto, setShowContacto] = useState(false);
  const [openBenefit, setOpenBenefit] = useState(null);

  // 🔄 Notifica al App.jsx cuando se abre/cierra el popup de contacto
  useEffect(() => {
    if (typeof setContactOpen === 'function') {
      setContactOpen(showContacto);
    }
  }, [showContacto, setContactOpen]);

  // 🔄 Cierra el sidebar si se selecciona un lote
  useEffect(() => {
    if (selectedLot) setSidebarOpen(false);
  }, [selectedLot]);

  // 🔄 Controla bloqueo de scroll en móvil
  useEffect(() => {
    const flag = isMobile && sidebarOpen;
    document.body.classList.toggle('sidebar-open-mobile', flag);
    return () => document.body.classList.remove('sidebar-open-mobile');
  }, [isMobile, sidebarOpen]);

  // 🔄 Manejo de apertura/cierre de beneficios
  const handleSelectTier = (tier) => {
    if (tier === 'todos') {
      onSelectTodos();
      setOpenBenefit(null);
      return;
    }
    onSelectTier(tier);
    setOpenBenefit(openBenefit === tier ? null : tier);
  };

  const tiers = ['oro', 'plata', 'bronce'];
  const activos = tiers.filter(t => !!activeTiers?.[t]);
  const selectedTier = activos.length === 1 ? activos[0] : null;

  return (
    <>
      {/* === Botón hamburguesa === */}
      <button
        className={`sidebar-toggle btn ${sidebarOpen ? 'rotated' : ''}`}
        onClick={() => {
          const next = !sidebarOpen;
          if (next && onClearSelection) onClearSelection();
          setSidebarOpen(next);
        }}
        aria-label={sidebarOpen ? 'Cerrar panel' : 'Abrir panel'}
      >
        {sidebarOpen ? '×' : '☰'}
      </button>

      {/* === Fondo difuminado en móvil === */}
      {isMobile && (
        <div
          className={`backdrop ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === Sidebar lateral === */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="controls">
          <img src={logoPath} alt="Logo IDRA" className="logo-sidebar" />

          {/* === Botones de vista solo en desktop === */}
          {!isMobile && (
            <>
              <button
                onClick={() => {
                  setTopView((v) => !v);
                  setAutoRotate(false);
                }}
                className="btn btn-vista"
              >
                <FaStreetView className='street-icon' /> Cambiar Vista
              </button>

              {!topView && (
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`btn ${autoRotate ? 'active' : ''}`}
                >
                  <FaArrowsRotate className='rotation-icon' /> Rotación Automática
                </button>
              )}
            </>
          )}

          {/* === Mostrar Lotes === */}
          <button
            onClick={() => setShowLotes(!showLotes)}
            className={`btn show-lotes ${showLotes ? 'active' : ''}`}
          >
            <FaMapMarkedAlt className='mapa-lotes' /> Mostrar Lotes
          </button>

          {/* === Contacto === */}
          <button
            onClick={() => setShowContacto(true)}
            className="btn contacto"
          >
            <FaWhatsapp className='icon-whatsapp' /> Contactanos
          </button>

          {/* === Filtros y beneficios === */}
          {showLotes && (
            <>
              <div className="tier-buttons">
                {/* === Oro === */}
                <div className="tier-with-benefit">
                  <button
                    onClick={() => handleSelectTier('oro')}
                    className={`btn oro ${activeTiers.oro ? 'active' : ''}`}
                  >
                    <span className="icon circle gold" /> Lotes Oro
                  </button>
                  {openBenefit === 'oro' && (
                    <div className="benefit-box oro">
                      <div className="benefit-title">Más que un lote, una oportunidad.</div>
                      <div className="benefit-text">{benefitTexts.oro}</div>
                    </div>
                  )}
                </div>

                {/* === Plata === */}
                <div className="tier-with-benefit">
                  <button
                    onClick={() => handleSelectTier('plata')}
                    className={`btn plata ${activeTiers.plata ? 'active' : ''}`}
                  >
                    <span className="icon circle silver" /> Lotes Plata
                  </button>
                  {openBenefit === 'plata' && (
                    <div className="benefit-box plata">
                      <div className="benefit-title">Más que un lote, una oportunidad.</div>
                      <div className="benefit-text">{benefitTexts.plata}</div>
                    </div>
                  )}
                </div>

                {/* === Bronce === */}
                <div className="tier-with-benefit">
                  <button
                    onClick={() => handleSelectTier('bronce')}
                    className={`btn bronce ${activeTiers.bronce ? 'active' : ''}`}
                  >
                    <span className="icon circle bronze" /> Lotes Bronce
                  </button>
                  {openBenefit === 'bronce' && (
                    <div className="benefit-box bronce">
                      <div className="benefit-title">Más que un lote, una oportunidad.</div>
                      <div className="benefit-text">{benefitTexts.bronce}</div>
                    </div>
                  )}
                </div>

                {/* === Mostrar Todos === */}
                <button
                  onClick={() => handleSelectTier('todos')}
                  className="btn todos"
                >
                  <span className="icon filter" /> Mostrar Todos
                </button>
              </div>

              {/* === Barra de progreso === */}
              <div className="sidebar-progress">
                <ProgressBar totalLots={totalLots} reservedCount={reservedCount} />
              </div>
            </>
          )}
        </div>
      </aside>

      {/* === Popup de contacto (Braian) === */}
      {showContacto && (
        <PopupContacto
          onClose={() => setShowContacto(false)}
        />
      )}
    </>
  );
}
