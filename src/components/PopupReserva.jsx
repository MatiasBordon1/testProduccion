// src/components/PopupReserva.jsx
import React, { useState, useEffect } from 'react';
import './PopupReserva.css';
import { oroLotes, plataLotes } from '../models/lote';

const LOGOS = {
  Bronce: '/assets/cancha/bronce.jpg',
  Plata: '/assets/cancha/plata.png',
  Oro: '/assets/cancha/dorado.png',
};

const PopupReserva = ({ selectedLot, onReserve, reservedLots, onClose, reservation }) => {
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    displayName: '',
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLot) setClosing(false);
  }, [selectedLot]);

  useEffect(() => {
    if (formData.anonymous) {
      setFormData((prev) => ({ ...prev, displayName: 'Anónimo' }));
    }
  }, [formData.anonymous]);

  // ✅ Bloquea el scroll del fondo mientras el popup está abierto (versión corregida)
useEffect(() => {
  if (!selectedLot) return;

  const body = document.body;
  const html = document.documentElement;

  // Guardamos el desplazamiento actual
  const scrollY = window.scrollY || window.pageYOffset;
  html.classList.add('popup-open');

  // Fijamos el body (bloquea scroll del fondo)
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflowY = 'hidden';

  return () => {
    // Restauramos estilos y posición
    html.classList.remove('popup-open');
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflowY = '';

    // Restauramos el scroll con un microdelay (Safari fix)
    setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: 'auto' });
    }, 10);
  };
}, [selectedLot]);

  if (!selectedLot) return null;

  // Si el lote ya está reservado y hay datos
  if (reservedLots.includes(selectedLot) && reservation) {
    return (
      <>
        <div className="popup-overlay" onClick={onClose} />
        <aside className="popup-reserva">
          <div className="popup-header">
            <img
              className="popup-logo"
              src={LOGOS[reservation.tier] || LOGOS.Bronce}
              alt="IDRA"
            />
            <button className="close-btn" onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>

          <h2>Detalles de Reserva</h2>
          <p><strong>Nombre:</strong> {reservation.firstName}</p>
          <p><strong>Mostrar como:</strong> {reservation.anonymous ? 'Anónimo' : reservation.displayName}</p>
          <button onClick={onClose}>Cerrar</button>
        </aside>
      </>
    );
  }

  // Tier y precio
  let tier = 'Bronce';
  let price = 300;
  if (oroLotes.includes(selectedLot)) { tier = 'Oro'; price = 1000; }
  else if (plataLotes.includes(selectedLot)) { tier = 'Plata'; price = 600; }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d+$/.test(formData.phone)) {
      alert('Por favor ingresa un número de teléfono válido (solo dígitos).');
      setLoading(false);
      return;
    }

    if (reservedLots.includes(selectedLot)) {
      alert('Lote ya reservado');
      setLoading(false);
      return;
    }

    await onReserve(selectedLot, formData);
    setLoading(false);
    setFormData({
      firstName: '',
      email: '',
      phone: '',
      displayName: '',
      anonymous: false,
    });
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { onClose(); setClosing(false); }, 300);
  };

  return (
    <>
      <div className="popup-overlay" onClick={handleClose} />
      <aside
        className={`popup-reserva ${tier.toLowerCase()} ${
          closing ? 'slide-out' : ''
        }`}
      >
        <div className="popup-header">
          <img className="popup-logo" src={LOGOS[tier]} alt={tier} />
          <button className="close-btn" onClick={handleClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="lot-info">
          <div className="lot-number">
            Lote {selectedLot} / {tier}
          </div>
          <div className="lot-price">Valor : {price} USD</div>
        </div>

        <form className="reservation-form" onSubmit={handleSubmit}>
          <label>
            Nombre y Apellido:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoFocus
              disabled={loading}
            />
          </label>

          <label>
            Correo Electrónico:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern=".+@.+"
              disabled={loading}
            />
          </label>

          <label>
            Teléfono:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label>
            ¿Cómo desea que aparezca su nombre/apellido en la placa?
            Puede ser por jugadora/or, por apellido/s, o empresa.
            <input
              type="text"
              name="displayName"
              value={formData.anonymous ? 'Anónimo' : formData.displayName}
              onChange={handleChange}
              required
              disabled={loading || formData.anonymous}
            />
          </label>

          <label className="anonymous-checkbox">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              disabled={loading}
            />
            Prefiero que sea anónimo
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`reserve-btn ${tier.toLowerCase()}`}
          >
            {loading ? 'Reservando...' : 'Reservar'}
            {loading && <span className="spinner"></span>}
          </button>
        </form>
      </aside>
    </>
  );
};

export default PopupReserva;
