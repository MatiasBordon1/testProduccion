// components/ProgressBar.jsx
import React from 'react';
import './ProgressBar.css';
import { LuHeartHandshake } from 'react-icons/lu';

const ProgressBar = ({ totalLots, reservedCount }) => {
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((Number(reservedCount || 0) / Number(totalLots || 0)) * 100) || 0)
  );

  return (
    <div className="progress-container">
      <div className="progress-label">
        <span className="progress-numbers">{reservedCount} / {totalLots}</span>
        <span className="progress-text">Lotes reservados</span>
        <LuHeartHandshake size={30} className="icon-heart" />
      </div>
    </div>
  );
};

export default ProgressBar;
