import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';

/**
 * Controla la posición y orientación de la cámara.
 * En móvil forzamos una vista completamente superior y centrada.
 */
function CameraController({ topView }) {
  const { camera } = useThree();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // 📱 Forzamos vista cenital 100% plana y centrada
      camera.position.set(0, 120, 0.01); // más alto y apenas sobre el eje
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
    } else if (topView) {
      // 💻 Vista superior en escritorio (usada al cambiar vista manualmente)
      camera.position.set(0, 100, 0.1);
      camera.up.set(0, 0, -1);
      camera.lookAt(-3.2, 0, 0);
    } else {
      // 💻 Vista isométrica
      camera.position.set(-3.2, 65, 89);
      camera.up.set(0, 1, 0);
      camera.lookAt(-3.2, 0, 0);
    }

    camera.updateProjectionMatrix();
  }, [topView, isMobile, camera]);

  return null;
}

export default CameraController;
