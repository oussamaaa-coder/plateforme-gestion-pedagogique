// 3D Background animation using react-three-fiber
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();
  
  // Create particles in a sphere or wave pattern
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Randomly scatter particles in a large space
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  const mouse = useRef([0, 0]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      ];
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Subtle rotation + mouse influence
    ref.current.rotation.y = time * 0.05 + mouse.current[0] * 0.1;
    ref.current.rotation.x = time * 0.02 + mouse.current[1] * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#c4cedb"
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
      />
    </Points>
  );
}

export default function Background3D() {
  return (
    <div 
        className="background-3d-container"
        style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: -2, 
            pointerEvents: 'none',
            background: '#ffffff' // Light background as requested "not full dark"
        }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
