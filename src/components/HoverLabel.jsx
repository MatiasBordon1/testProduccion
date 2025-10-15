import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Sprite, SpriteMaterial, CanvasTexture } from 'three';
import { useFrame } from '@react-three/fiber';

const HoverLabel = ({ position, index }) => {
  const spriteRef = React.useRef();

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(index.toString(), 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, [index]);

  useFrame(() => {
    if (spriteRef.current) {
      spriteRef.current.quaternion.copy(spriteRef.current.parent.quaternion);
    }
  });

  return (
    <sprite ref={spriteRef} position={[position[0], position[1] + 0.05, position[2]]} scale={[5, 5, 1]}>
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

export default HoverLabel;
