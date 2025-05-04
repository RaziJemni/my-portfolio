"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";

const COLORS = ["#0077FF", "#FF7700"]; // blue & orange

function SphereParticles({
  rotationRef,
  isDragging,
  dragSpeed,
  baseRotationSpeed,
}: {
  rotationRef: React.RefObject<THREE.Group>;
  isDragging: React.MutableRefObject<boolean>;
  dragSpeed: React.MutableRefObject<{ x: number; y: number }>;
  baseRotationSpeed: number;
}) {
  const sphereData = useMemo(() => {
    const count = 200;
    const positions = [];
    const colors = [];
    const lineIndices: number[] = [];
    const lineColors = [];

    const blue = new THREE.Color("#0077FF");
    const orange = new THREE.Color("#FF7700");

    // Generate particles on a sphere
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      const color = new THREE.Color(COLORS[i % 2]);
      colors.push(color.r, color.g, color.b);
    }

    // Connect nearby particles and assign alternating colors
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 0.3) {
          lineIndices.push(i, j);

          // Alternate between blue and orange for each line
          const color = lineIndices.length % 4 < 2 ? blue : orange;
          lineColors.push(color.r, color.g, color.b);
          lineColors.push(color.r, color.g, color.b);
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      lineIndices: new Uint16Array(lineIndices),
      lineColors: new Float32Array(lineColors),
    };
  }, []);

  useFrame(() => {
    const group = rotationRef.current;
    if (!group) return;

    if (isDragging.current) {
      group.rotation.y += dragSpeed.current.x;
      group.rotation.x += dragSpeed.current.y;

      dragSpeed.current.x *= 0.9; // smooth out
      dragSpeed.current.y *= 0.9;
    } else {
      group.rotation.y += baseRotationSpeed;

      // Apply easing to the rotation after drag
      dragSpeed.current.x *= 0.95;
      dragSpeed.current.y *= 0.95;

      group.rotation.y += dragSpeed.current.x;
      group.rotation.x += dragSpeed.current.y;
    }
  });

  return (
    <group ref={rotationRef}>
      {/* Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={sphereData.positions}
            count={sphereData.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={sphereData.colors}
            count={sphereData.colors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={sphereData.positions}
            count={sphereData.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={sphereData.lineIndices}
            count={sphereData.lineIndices.length}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-color"
            array={sphereData.lineColors}
            count={sphereData.lineColors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true} // Enable vertex colors for lines
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function ParticleSphere() {
  const rotationRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const dragSpeed = useRef({ x: 0, y: 0 });
  const previousPointer = useRef({ x: 0, y: 0 });

  const baseRotationSpeed = 0.0025;

  const [cameraSettings, setCameraSettings] = useState({
    position: [0, 0, 3], // Default camera position
    fov: 60, // Default field of view
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Adjust camera for mobile to keep the sphere size consistent
        setCameraSettings({ position: [0, 0, 3.5], fov: 30 });
      } else {
        // Default camera for larger screens
        setCameraSettings({ position: [0, 0, 3], fov: 50 });
      }
    };

    const handleGlobalPointerUp = () => {
      isDragging.current = false; // Reset dragging state globally
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerup", handleGlobalPointerUp); // Listen for pointerup globally

    // Initial check for screen size
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", handleGlobalPointerUp); // Clean up listener
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    isDragging.current = true;
    previousPointer.current = { x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    e.preventDefault(); // Prevent scrolling during drag

    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const currentY = e.clientY || e.touches?.[0]?.clientY;

    const dx = currentX - previousPointer.current.x;
    const dy = currentY - previousPointer.current.y;

    dragSpeed.current.x = dx * 0.004;
    dragSpeed.current.y = dy * 0.004;

    previousPointer.current = { x: currentX, y: currentY };
  };

  const handlePointerUp = () => {
    isDragging.current = false; // Reset dragging state
  };

  return (
    <div
      className="w-full h-full aspect-square touch-none" // Prevent touch gestures like scrolling
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Canvas camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}>
        <ambientLight intensity={0.5} />
        <SphereParticles
          rotationRef={rotationRef}
          isDragging={isDragging}
          dragSpeed={dragSpeed}
          baseRotationSpeed={baseRotationSpeed}
        />
      </Canvas>
    </div>
  );
}
