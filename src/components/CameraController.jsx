import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

/**
 * Controla la posición de la cámara SOLO en desktop.
 * En móvil usamos OrthographicCamera + MapControls (definidos en Cancha3D).
 */
function CameraController({ topView }) {
  const { camera } = useThree();

  useEffect(() => {
    if (topView) {
      // 📷 Vista cenital (desde arriba)
      camera.position.set(0, 100, 0.1);
      camera.up.set(0, 0, -1);
      camera.lookAt(-3.2, 0, 0);
    } else {
      // 📷 Vista isométrica (rotación)
      // Aumentamos altura y distancia para evitar que las esquinas se corten
      camera.position.set(-3.2, 65, 89); // <--- ajustado
      camera.up.set(0, 1, 0);
      camera.lookAt(-3.2, 0, 0);
    }

    camera.updateProjectionMatrix();
  }, [topView, camera]);

  return null;
}

export default CameraController;
