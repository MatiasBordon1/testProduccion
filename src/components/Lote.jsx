import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { Html, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import './Lote.css';

const LOT_SCALE = 0.88;
const BASE_Y = 0.099;

const Lote = ({
  position,
  color,
  index,
  onLoteClick,
  visible,
  isReserved,
  showLotes,
  reservation,
  isSelected,
  tier = 'bronce',
}) => {
  const [hovered, setHovered] = useState(false);

  const { scale } = useSpring({
    scale: isSelected ? 1.1 : 1,
    config: { tension: 150, friction: 12 },
  });

  const [x, y, z] = position;
  const width = (92 / 10) * LOT_SCALE;
  const depth = (51 / 10) * LOT_SCALE;

  if (!visible) return null;

  // 🔹 Texto o nombre mostrado en el lote
  const displayLabel = isReserved
    ? (reservation?.mostrarComo ||
       reservation?.MostrarComo ||
       reservation?.displayName ||
       'Reservado')
    : index;

  // 🔹 Color del corazón según tier
  const heartColor = reservation?.heartColor || (tier === 'oro' ? 'naranja' : 'celeste');

  const HEART_PATHS = {
    naranja: ['/assets/cancha/corazon_naranja.png', '/cancha/corazon_naranja.png'],
    celeste: ['/assets/cancha/corazon_azul.png', '/cancha/corazon_azul.png'],
  };
  const initialHeartSrc = HEART_PATHS[heartColor]?.[0] || '/assets/cancha/corazon_azul.png';
  const [heartSrc, setHeartSrc] = useState(initialHeartSrc);

  const handleHeartError = () => {
    const candidates = HEART_PATHS[heartColor] || [];
    const next = candidates.find(p => p !== heartSrc);
    if (next) setHeartSrc(next);
  };

  // 🔹 Tamaño del texto dinámico
  const calcularFontSize = (texto) => {
    const len = texto?.toString().length || 0;
    if (len <= 6) return 1.2;
    if (len <= 10) return 0.9;
    if (len <= 15) return 0.7;
    return 0.5;
  };

  return (
    <group position={[x, isSelected ? BASE_Y + 0.5 : BASE_Y, z]}>
      {/* ==== PLANO BASE DEL LOTE ==== */}
      <animated.mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={scale}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          const box = new THREE.Box3().setFromObject(e.object);
          const center = new THREE.Vector3();
          box.getCenter(center);
          center.y = BASE_Y + 0.2;
          onLoteClick(index, [center.x, center.y, center.z]);
        }}
        style={{ cursor: 'pointer' }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={showLotes ? 0.7 : 0}
        />
      </animated.mesh>

      {/* ==== CORAZÓN DE RESERVA ==== */}
      {!showLotes && isReserved && (
        <Html
          position={[0, 0.12, 0]}
          center
          transform
          rotation-x={-Math.PI / 2}
          distanceFactor={8}
          wrapperClass="lote-heart-html"
          zIndexRange={[0, 0]}
          style={{ zIndex: 1, pointerEvents: 'none' }}
        >
          <img
            src={heartSrc}
            onError={handleHeartError}
            alt="Reservado"
            className="lote-heart-img"
            draggable={false}
          />
        </Html>
      )}

      {/* ==== TEXTO DENTRO DEL LOTE ==== */}
      {showLotes && (
        <Text
          position={[0, 0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={calcularFontSize(displayLabel)}
          maxWidth={width * 0.9}
          color={isReserved ? '#f5e9c5' : '#d4af37'}
          anchorX="center"
          anchorY="middle"
        >
          {displayLabel}
        </Text>
      )}
    </group>
  );
};

export default Lote;
