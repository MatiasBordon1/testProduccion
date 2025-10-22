// src/components/Cancha3D.jsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MapControls, Html, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

import useIsMobile from '../hooks/useIsMobile';
import { crearLotes, oroLotes, plataLotes } from '../models/lote';
import { getColor } from '../utils/colores';
import LoteTooltipCard from './LoteTooltipCard';
import Lote from './Lote';
import LoteMobileOverlay from './LoteMobileOverlay';
import HockeyLines from './HockeyLines';
import CanchaBase from './CanchaBase';
import CameraController from './CameraController';

function Scene({
  isMobile,
  topView,
  autoRotate,
  setAutoRotate,
  showLotes,
  lotesCargados,
  activeTiers,
  onSelectLot,
  reservedLots,
  reservedDetails,
  selectedLotId,
  onPreviewRequest,
}) {
  const groupRef = useRef();

  useEffect(() => {
    if (!autoRotate && groupRef.current && !isMobile) {
      groupRef.current.rotation.y = 0;
    }
  }, [autoRotate, isMobile]);

  const lotes = useMemo(() => {
    if (!lotesCargados) return [];
    return crearLotes({
      colorBase: getColor,
      onClick: (id) => onSelectLot(id),
      showLotes,
      activeTiers,
      reservedLots,
    });
  }, [lotesCargados, showLotes, activeTiers, onSelectLot, reservedLots]);

  useFrame(() => {
    if (!topView && !isMobile && autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const groupPosition = isMobile ? [0, 0, 0] : [-3, 0, 0];
  const groupScale = isMobile ? [1, 1, 1] : [0.8, 0.8, 0.8];
  const mobileYRotation = isMobile ? Math.PI / 2 : 0;

  return (
    <group
      ref={groupRef}
      position={groupPosition}
      scale={groupScale}
      rotation={[0, mobileYRotation, 0]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[60, 120, 80]}
        intensity={1.3}
        castShadow={!isMobile && !topView}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={400}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-bias={-0.0002}
      />
      <hemisphereLight
        skyColor={'#e3ecff'}
        groundColor={'#3f3f3f'}
        intensity={0.4}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4, 0]}
        receiveShadow
        raycast={null}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <planeGeometry args={[400, 400]} />
        <shadowMaterial opacity={0.25} transparent />
      </mesh>

      <group raycast={null} onPointerDown={(e) => e.stopPropagation()}>
        <CameraController topView={topView} />
        <CanchaBase />
        <HockeyLines />
      </group>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        castShadow
        receiveShadow
        raycast={null}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <planeGeometry args={[91.4, 55]} />
        <meshStandardMaterial color="#b3a977" side={THREE.DoubleSide} />
      </mesh>

      {lotes.map((lote) => {
        const y = 1;
        const isReserved = reservedLots.includes(lote.id);
        let tier = 'bronce';
        if (oroLotes.includes(lote.id)) tier = 'oro';
        else if (plataLotes.includes(lote.id)) tier = 'plata';
        const color = isReserved ? '#c0392b' : getColor(lote.id, activeTiers);

        return (
          <Lote
            key={lote.id}
            index={lote.id}
            position={[lote.position[0], y, lote.position[2]]}
            color={color}
            visible
            isReserved={isReserved}
            showLotes={showLotes}
            reservation={reservedDetails[lote.id]}
            scale={lote.scale}
            isSelected={lote.id === selectedLotId}
            tier={tier}
            onLoteClick={(idFromChild, worldPosFromChild) => {
              if (!groupRef.current) return;
              setAutoRotate(false);
              const useId = idFromChild ?? lote.id;
              const pos = Array.isArray(worldPosFromChild)
                ? [
                    worldPosFromChild[0],
                    worldPosFromChild[1] + 2.5,
                    worldPosFromChild[2],
                  ]
                : [lote.position[0], 2.5, lote.position[2]];
              onPreviewRequest(useId, pos);
            }}
          />
        );
      })}
    </group>
  );
}

function PopupHtml({ preview, topView, onClose, onReservar }) {
  if (!preview) return null;

  const style = {
    pointerEvents: 'auto',
    transform: topView ? 'translate(-50%, -100%)' : undefined,
    zIndex: 999,
  };
  const factor = topView ? 35 : 15;
  const position = [
    preview.position[0],
    preview.position[1] + (topView ? 0.0001 : 3.5),
    preview.position[2],
  ];

  return (
    <Html
      position={position}
      transform={!topView}
      center
      rotation={topView ? [Math.PI / 2, 0, 0] : undefined}
      distanceFactor={factor}
      style={style}
    >
      <LoteTooltipCard
        lotId={preview.id}
        tier={preview.tier}
        reserved={preview.reserved}
        reservedDisplayName={preview.displayName}
        onClose={onClose}
        onReservar={onReservar}
      />
    </Html>
  );
}

export default function Cancha3D({
  showLotes,
  lotesCargados,
  topView,
  activeTiers,
  autoRotate,
  setAutoRotate,
  onSelectLot,
  reservedLots,
  reservedDetails,
  selectedLot,
  contactOpen,
}) {
  const isMobile = useIsMobile();
  const [preview, setPreview] = useState(null);
  const cameraRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(3.5);

  // 🔭 fijar zoom inicial y sincronizar al montar la cámara
  useEffect(() => {
    if (cameraRef.current) {
      const targetZoom = isMobile ? 3.5 : 12;
      cameraRef.current.zoom = targetZoom;
      cameraRef.current.updateProjectionMatrix();
      setZoomLevel(targetZoom);
    }
  }, [isMobile]);

  const effectiveTopView = isMobile ? true : topView;
  const [localAutoRotate, setLocalAutoRotate] = useState(false);
  const effectiveAutoRotate =
    typeof autoRotate === 'boolean' ? autoRotate : localAutoRotate;
  const effectiveSetAutoRotate =
    typeof setAutoRotate === 'function' ? setAutoRotate : setLocalAutoRotate;

  useEffect(() => {
    if (contactOpen) setPreview(null);
  }, [contactOpen]);

const handleZoomChange = (dir) => {
  if (!cameraRef.current) return;
  const camera = cameraRef.current;

  const minZoom = 3;
  const maxZoom = 25;
  const step = 1.5;

  let newZoom = camera.zoom;
  if (dir === 'in') newZoom = Math.min(maxZoom, newZoom + step);
  else if (dir === 'out') newZoom = Math.max(minZoom, newZoom - step);

  camera.zoom = newZoom;
  camera.updateProjectionMatrix();
  setZoomLevel(newZoom); // sólo sigue, no controla
};

  const handleLotClickForPreview = (id, positionVec3) => {
    const tier = oroLotes.includes(id)
      ? 'oro'
      : plataLotes.includes(id)
      ? 'plata'
      : 'bronce';
    const isReserved = reservedLots.includes(id);
    const reservation = reservedDetails?.[id] ?? {};
    const displayName =
      reservation?.mostrarComo ||
      reservation?.displayName ||
      reservation?.firstName ||
      '';
    setPreview({
      id,
      position: positionVec3 || [0, 2.5, 0],
      tier,
      reserved: isReserved,
      displayName,
    });
  };

  const startReservationFromPreview = () => {
    if (!preview?.id) return;
    onSelectLot(preview.id);
    setPreview(null);
  };

  return (
    <div className={`canvas-wrapper ${selectedLot ? 'shift-left' : ''}`}>
      <Canvas
        shadows
        camera={{ position: [0, 110, 175], fov: 45 }}
        style={{ width: '100%', height: '100vh', touchAction: 'none' }}
      >
        <Scene
          isMobile={isMobile}
          topView={effectiveTopView}
          autoRotate={effectiveAutoRotate}
          setAutoRotate={effectiveSetAutoRotate}
          showLotes={showLotes}
          lotesCargados={lotesCargados}
          activeTiers={activeTiers}
          onSelectLot={onSelectLot}
          reservedLots={reservedLots}
          reservedDetails={reservedDetails}
          selectedLotId={selectedLot}
          onPreviewRequest={handleLotClickForPreview}
        />

        {isMobile && (
          <>
            <OrthographicCamera
  ref={cameraRef}
  makeDefault
  position={[0, 90, 0.1]} // podés subir o bajar el 100
  up={[0, 0, -1]}
  zoom={zoomLevel}
  near={0.1}
  far={1000}
  onUpdate={(c) => {
    // ⚠️ eliminamos el chequeo c.zoom !== zoomLevel
    c.lookAt(0, 0, 0);
  }}
/>
            <MapControls
              makeDefault
              enableRotate={false}
              enableZoom={false}
              enablePan
              screenSpacePanning
              target={[0, 0, 0]}
              panSpeed={0.9}
              touches={{ ONE: THREE.TOUCH.PAN }}
            />
          </>
        )}

        {preview && !effectiveAutoRotate && !isMobile && (
          <PopupHtml
            preview={preview}
            topView={effectiveTopView}
            onClose={() => setPreview(null)}
            onReservar={startReservationFromPreview}
          />
        )}
      </Canvas>

      {isMobile && preview && (
        <LoteMobileOverlay
          preview={preview}
          onClose={() => setPreview(null)}
          onReservar={startReservationFromPreview}
        />
      )}

      {isMobile && (
        <div className="zoom-buttons mobile-only">
          <button onClick={() => handleZoomChange('out')}>−</button>
          <button onClick={() => handleZoomChange('in')}>+</button>
        </div>
      )}
    </div>
  );
}
