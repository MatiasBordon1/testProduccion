import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';

/**
 * Controla la posición y orientación de la cámara.
 * En móvil ya hay una OrthographicCamera aparte, así que no la tocamos.
 */
function CameraController({ topView }) {
  const { camera } = useThree();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // 📱 NO modificamos la cámara ortográfica ni su zoom
      return;
    }

    if (topView) {
      // 💻 Vista superior (desktop)
      camera.position.set(0, 100, 0.1);
      camera.up.set(0, 0, -1);
      camera.lookAt(-3.2, 0, 0);
    } else {
      // 💻 Vista isométrica (desktop)
      camera.position.set(-3.2, 65, 89);
      camera.up.set(0, 1, 0);
      camera.lookAt(-3.2, 0, 0);
    }

    camera.updateProjectionMatrix();
  }, [topView, isMobile, camera]);

  return null;
}

export default CameraController;
