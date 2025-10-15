import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

/**
 * Logo central del campo (vectorizado).
 * - flip180: invierte 180° si quedara cabeza abajo (p.ej. en topView móvil).
 * - rotateZ: rotación adicional en radianes dentro del plano de la cancha.
 */
export default function LogoCentral({ flip180 = false, rotateZ = 0 }) {
  const texture = useLoader(TextureLoader, '/assets/cancha/idra-blanco.png');

  // Para que quede siempre por encima de líneas y grilla
  const materialProps = { transparent: true, depthWrite: false, depthTest: false };

  return (
    <mesh
      position={[0, 0.011, 0]}
      // -Math.PI/2 tumba el plano; luego sumamos la rotación en Z dentro del plano
      rotation={[-Math.PI / 2, 0, (flip180 ? Math.PI : 0) + rotateZ]}
      renderOrder={10}
    >
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial map={texture} {...materialProps} />
    </mesh>
  );
}
