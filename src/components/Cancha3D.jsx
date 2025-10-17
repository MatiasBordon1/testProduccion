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

  const lotes = useMemo(
    () =>
      crearLotes({
        colorBase: getColor,
        onClick: (id) => onSelectLot(id),
        showLotes,
        activeTiers,
        reservedLots,
      }),
    [showLotes, activeTiers, onSelectLot, reservedLots]
  );

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

      {/* 🔳 Sombra bajo la cancha */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <shadowMaterial opacity={0.25} transparent />
      </mesh>

      <CameraController topView={topView} />
      <CanchaBase />
      <HockeyLines />

      {/* 🟩 Piso base */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        castShadow
        receiveShadow
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
            enableHover
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
  const [zoomLevel, setZoomLevel] = useState(12);

  const effectiveTopView = isMobile ? true : topView;
  const [localAutoRotate, setLocalAutoRotate] = useState(false);
  const effectiveAutoRotate =
    typeof autoRotate === 'boolean' ? autoRotate : localAutoRotate;
  const effectiveSetAutoRotate =
    typeof setAutoRotate === 'function' ? setAutoRotate : setLocalAutoRotate;

  useEffect(() => {
    if (
      typeof effectiveAutoRotate === 'boolean' &&
      typeof effectiveTopView === 'boolean'
    )
      setPreview(null);
    if (contactOpen) setPreview(null);
  }, [!!effectiveAutoRotate, !!effectiveTopView, contactOpen]);

  // ✅ Control del zoom desde botones
  const handleZoomChange = (dir) => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;

    const minZoom = 4;
    const maxZoom = 25;
    const step = 1.5;

    if (dir === 'in') {
      camera.zoom = Math.min(maxZoom, camera.zoom + step);
    } else if (dir === 'out') {
      camera.zoom = Math.max(minZoom, camera.zoom - step);
    }

    camera.updateProjectionMatrix();
    setZoomLevel(camera.zoom);
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
          activeTiers={activeTiers}
          onSelectLot={onSelectLot}
          reservedLots={reservedLots}
          reservedDetails={reservedDetails}
          selectedLotId={selectedLot}
          onPreviewRequest={handleLotClickForPreview}
        />

        {/* ✅ Cámara ortográfica + paneo solo en móvil */}
        {isMobile && (
          <>
            <OrthographicCamera
              ref={cameraRef}
              makeDefault
              position={[0, 100, 0.1]}
              up={[0, 0, -1]}
              zoom={zoomLevel}
              near={0.1}
              far={1000}
              onUpdate={(c) => c.lookAt(0, 0, 0)}
            />
            <MapControls
              makeDefault
              enableRotate={false}
              enableZoom={true}
              enablePan
              screenSpacePanning
              target={[0, 0, 0]}
              panSpeed={0.9}
              touches={{ ONE: THREE.TOUCH.PAN }}
            />
          </>
        )}

        {/* Popup desktop */}
        {preview && !effectiveAutoRotate && !isMobile && (
          <PopupHtml
            preview={preview}
            topView={effectiveTopView}
            onClose={() => setPreview(null)}
            onReservar={startReservationFromPreview}
          />
        )}
      </Canvas>

      {/* Popup móvil */}
      {isMobile && preview && (
        <LoteMobileOverlay
          preview={preview}
          onClose={() => setPreview(null)}
          onReservar={startReservationFromPreview}
        />
      )}

      {/* ✅ Botones de zoom solo móviles */}
      {isMobile && (
        <div className="zoom-buttons mobile-only">
          <button onClick={() => handleZoomChange('out')}>−</button>
          <button onClick={() => handleZoomChange('in')}>+</button>
        </div>
      )}
    </div>
  );
}
