// src/components/HockeyLines.jsx
import React from 'react';
import * as THREE from 'three';

const HockeyLines = () => {
  const lines = [];

  // Dibuja línea recta normal
  const drawLine = (start, end, color = 'white', opacity = 1) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]);
    lines.push(
      <line key={`${start}-${end}`} geometry={geometry}>
        <lineBasicMaterial color={color} linewidth={3} depthTest={false} transparent opacity={opacity} />
      </line>
    );
  };

  // Dibuja arco normal o dashed
  const drawArc = (center, radius, startAngle, endAngle, segments = 64, dashed = false) => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (i / segments) * (endAngle - startAngle);
      points.push(new THREE.Vector3(
        center[0] + radius * Math.cos(angle),
        center[1],
        center[2] + radius * Math.sin(angle)
      ));
    }

    if (dashed) {
      // Segmentar el arco en pequeños tramos
      const dashLength = 2; // largo de trazo
      const gapLength = 1;  // espacio entre trazos
      let currentLength = 0;

      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        const segmentLength = start.distanceTo(end);

        if ((currentLength % (dashLength + gapLength)) < dashLength) {
          const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
          lines.push(
            <line key={`dashed-arc-${center}-${i}`} geometry={geometry}>
              <lineBasicMaterial color="white" linewidth={3} depthTest={false} transparent opacity={1} />
            </line>
          );
        }
        currentLength += segmentLength;
      }
    } else {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(
        <line key={`arc-${center}-${radius}`} geometry={geometry}>
          <lineBasicMaterial color="white" linewidth={3} depthTest={false} transparent opacity={1} />
        </line>
      );
    }
  };

  const width = 91.4;
  const height = 55;
  const margin = 5; // enmarque blanco interno

  // Enmarque interior blanco (a 5m de los bordes)
  drawLine([-width/2 + margin, 0.01, -height/2 + margin], [width/2 - margin, 0.01, -height/2 + margin]); // arriba
  drawLine([-width/2 + margin, 0.01, height/2 - margin], [width/2 - margin, 0.01, height/2 - margin]);   // abajo
  drawLine([-width/2 + margin, 0.01, -height/2 + margin], [-width/2 + margin, 0.01, height/2 - margin]); // izquierda
  drawLine([width/2 - margin, 0.01, -height/2 + margin], [width/2 - margin, 0.01, height/2 - margin]);   // derecha

  // Arcos semicirculares desde el borde interno:
  // --- normales ---
  drawArc([-width/2 + margin, 0.01, 0], 14.63, -Math.PI / 2, Math.PI / 2);
  drawArc([width/2 - margin, 0.01, 0], 14.63, Math.PI / 2, (3 * Math.PI) / 2);

  // --- dashed ---
  drawArc([-width/2 + margin, 0.01, 0], 21.63, -Math.PI / 2, Math.PI / 2, 64, true);
  drawArc([width/2 - margin, 0.01, 0], 21.63, Math.PI / 2, (3 * Math.PI) / 2, 64, true);

// Línea media central más gruesa (directamente dibujada con material más ancho)
{
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.011, -height / 2 + margin),
    new THREE.Vector3(0, 0.011, height / 2 - margin)
  ]);
  lines.push(
    <line key="center-line" geometry={geometry}>
      <lineBasicMaterial color="white" linewidth={20} depthTest={false} transparent opacity={1} />
    </line>
  );
}

// Círculo central relleno sólido
{
  const circleRadius = 1; // radio del círculo
  const circleSegments = 64;

  const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
  lines.push(
    <mesh key="center-circle" geometry={circleGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
      <meshBasicMaterial color="white" depthTest={false} transparent opacity={1} />
    </mesh>
  );
}


  // Grilla de lotes (10x10) dentro del marco interno (margin)
  const rows = 10;
  const cols = 10;
  const innerWidth = width - margin * 2;
  const innerHeight = height - margin * 2;
  const lotWidth = innerWidth / cols;
  const lotHeight = innerHeight / rows;
  const gridColor = '#dddddd'; // blanco menos intenso para diferenciarlo

  // líneas verticales de la grilla (dentro del marco)
  for (let j = 1; j < cols; j++) {
    const x = -width / 2 + margin + j * lotWidth;
    drawLine([x, 0.011, -height / 2 + margin], [x, 0.011, height / 2 - margin], gridColor, 0.4);
  }

  // líneas horizontales de la grilla (dentro del marco)
  for (let i = 1; i < rows; i++) {
    const z = -height / 2 + margin + i * lotHeight;
    drawLine([-width / 2 + margin, 0.011, z], [width / 2 - margin, 0.011, z], gridColor, 0.4);
  }

  return <group>{lines}</group>;
};

export default HockeyLines;
