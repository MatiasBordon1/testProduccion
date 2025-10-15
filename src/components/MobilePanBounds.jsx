import { useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Restringe el paneo y el target dentro del campo (con un padding).
 * Úsalo SOLO con OrthographicCamera + MapControls en móvil.
 */
export default function MobilePanBounds({ controlsRef }) {
  const { camera } = useThree();

  const bounds = useMemo(() => {
    const pad = 6;
    return { x: 91.4 / 2 + pad, z: 55 / 2 + pad };
  }, []);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls || !camera.isOrthographicCamera) return;

    // Clamp posición de cámara
    const { x, y, z } = camera.position;
    const clampedX = THREE.MathUtils.clamp(x, -bounds.x, bounds.x);
    const clampedZ = THREE.MathUtils.clamp(z, -bounds.z, bounds.z);
    if (clampedX !== x || clampedZ !== z) camera.position.set(clampedX, y, clampedZ);

    // Clamp target de los controles
    const t = controls.target;
    const tX = THREE.MathUtils.clamp(t.x, -bounds.x, bounds.x);
    const tZ = THREE.MathUtils.clamp(t.z, -bounds.z, bounds.z);
    if (tX !== t.x || tZ !== t.z) {
      controls.target.set(tX, t.y, tZ);
      controls.update();
    }
  });

  return null;
}
