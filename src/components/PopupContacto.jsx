import React from "react";
import "./PopupContacto.css";
import contactoImg from '../assets/cancha/braian.jpg';
import { FaWhatsapp } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

export default function PopupContacto({ onClose }) {
  return (
    <div className="popup-contacto-overlay">
      <div className="popup-contacto">
        <button className="close-btn" onClick={onClose}><IoCloseSharp /></button>
        <div className="popup-header">
          <img
            src="/assets/cancha/braian.jpg"
            alt="Contacto"
            className="contacto-img"
          />
          <div>
            <h3>¿Tenés dudas o consultas?</h3>
            <p>
              Podés escribirle directamente a <strong>Braian Bruni</strong>,
              Coordinador General del Club.
            </p>
            <p>
              Teléfono:{" "}
              <a
                href="https://wa.me/5492236216365"
                target="_blank"
                rel="noopener noreferrer"
              >
                +54 9 2236 21-6365
              </a>
            </p>

          </div>
        </div>
        <p className="texto-extra">
          <strong>Cada aporte es parte de esta historia que seguimos escribiendo en equipo.</strong>
        </p>
        <a
          href="https://wa.me/5492236216365"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <FaWhatsapp className="icon-whastapp" /> Link Directo
        </a>
      </div>
    </div>
  );
}
