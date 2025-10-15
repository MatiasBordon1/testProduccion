const CanchaBase = ({ withShadows = true }) => {
  const BORDER_Y_OFFSET = -0.8;
  const WIDTH = 91.4;
  const HEIGHT = 55;
  const THICK = 2;
  const MARGIN = 2;

  const leftW = MARGIN;
  const rightW = MARGIN;
  const topH = MARGIN;
  const bottomH = MARGIN;

  const innerWidth = WIDTH - MARGIN * 2;
  const innerHeight = HEIGHT;

  return (
    <group>
      {/* Marco izquierdo */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-WIDTH / 2 + leftW / 2, BORDER_Y_OFFSET, 0]}
        receiveShadow={withShadows}
        castShadow={withShadows}
      >
        <boxGeometry args={[leftW, innerHeight, THICK]} />
        <meshStandardMaterial color="#165887" />
      </mesh>

      {/* Marco derecho */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[WIDTH / 2 - rightW / 2, BORDER_Y_OFFSET, 0]}
        receiveShadow={withShadows}
        castShadow={withShadows}
      >
        <boxGeometry args={[rightW, innerHeight, THICK]} />
        <meshStandardMaterial color="#165887" />
      </mesh>

      {/* Marco superior */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, BORDER_Y_OFFSET, HEIGHT / 2 - topH / 2]}
        receiveShadow={withShadows}
        castShadow={withShadows}
      >
        <boxGeometry args={[innerWidth, topH, THICK]} />
        <meshStandardMaterial color="#165887" />
      </mesh>

      {/* Marco inferior */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, BORDER_Y_OFFSET, -HEIGHT / 2 + bottomH / 2]}
        receiveShadow={withShadows}
        castShadow={withShadows}
      >
        <boxGeometry args={[innerWidth, bottomH, THICK]} />
        <meshStandardMaterial color="#165887" />
      </mesh>
    </group>
  );
};

export default CanchaBase;
