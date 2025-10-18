import React, { useState } from 'react';
import * as THREE from 'three';
import { Text, useLoader } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { TextureLoader } from 'three';
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
  const [pointerStart, setPointerStart] = useState(null);
  const MOVE_THRESHOLD = 5; // tolerancia de movimiento táctil

  const { scale } = useSpring({
    scale: isSelected ? 1.1 : 1,
    config: { tension: 150, friction: 12 },
  });

  const [x, , z] = position;
  const width = (92 / 10) * LOT_SCALE;
  const depth = (51 / 10) * LOT_SCALE;

  if (!visible) return null;

  // 🔹 Texto o nombre mostrado
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
  const heartSrc = HEART_PATHS[heartColor]?.[0] || '/assets/cancha/corazon_azul.png';

  // 🔹 Cargar textura del corazón
  const heartTexture = useLoader(TextureLoader, heartSrc);

  // 🧠 Mejora de calidad
  heartTexture.minFilter = THREE.LinearFilter;
  heartTexture.magFilter = THREE.NearestFilter;
  heartTexture.anisotropy = 16;
  heartTexture.needsUpdate = true;

  // 🔹 Tamaño del texto dinámico
  const calcularFontSize = (texto) => {
    const len = texto?.toString().length || 0;
    if (len <= 6) return 1.2;
    if (len <= 10) return 0.9;
    if (len <= 15) return 0.7;
    return 0.5;
  };

  return (
    <group position={[x, isSelected ? BASE_Y + 0.5 : BASE_Y + 0.4, z]}>
      {/* ==== PLANO BASE DEL LOTE ==== */}
      <animated.mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={scale}
        castShadow
        receiveShadow
        renderOrder={1}
        onPointerDown={(e) => {
          // Guardar posición inicial del toque
          setPointerStart({ x: e.clientX, y: e.clientY });
        }}
        onPointerUp={(e) => {
          if (
            pointerStart &&
            Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) <
              MOVE_THRESHOLD
          ) {
            e.stopPropagation();
            const box = new THREE.Box3().setFromObject(e.object);
            const center = new THREE.Vector3();
            box.getCenter(center);
            center.y = BASE_Y + 0.2;
            console.log(
              `🟢 Click detectado en lote ${index} (${isReserved ? 'RESERVADO' : 'disponible'})`,
              'Posición:',
              [center.x, center.y, center.z]
            );
            onLoteClick(index, [center.x, center.y, center.z]);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={showLotes ? 0.7 : 0}
          depthWrite={showLotes}
        />
      </animated.mesh>

      {/* ==== CORAZÓN 3D CON TEXTURA ==== */}
      {!showLotes && isReserved && (
        <mesh
          position={[0, 0.25, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={2}
          raycast={null}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <planeGeometry args={[width * 0.5, depth * 0.5]} />
          <meshBasicMaterial
            map={heartTexture}
            transparent
            opacity={1}
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ==== TEXTO DEL LOTE ==== */}
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
