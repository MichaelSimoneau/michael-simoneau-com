import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
// @ts-expect-error maath has no type definitions
import { random } from 'maath';

const ANIMATION_FACTOR = 0.002;
const TUNNELING_PROBABILITY = 0.008;

function QuantumParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create two sets of particles for interference effect
  const [sphere] = React.useState(() => {
    // More particles for denser field
    const positions = new Float32Array(3000 * 3);
    const validPositions = random.inSphere(positions, { radius: 25 }) as Float32Array;
    
    // Validate positions
    for (let i = 0; i < validPositions.length; i++) {
      if (isNaN(validPositions[i])) validPositions[i] = 0;
    }
    return validPositions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * ANIMATION_FACTOR;
      ref.current.rotation.y -= delta * ANIMATION_FACTOR;

      // Quantum fluctuation/tunneling
      const particlesToProcess = Math.ceil(sphere.length / 3 / 15);
      const offset = Math.floor((state.clock.getElapsedTime() * particlesToProcess) % (sphere.length / 3));

      for (let i = 0; i < particlesToProcess; i++) {
        const index = (offset + i) % (sphere.length / 3);
        if (Math.random() < TUNNELING_PROBABILITY) {
          // Quantum jump
          sphere[index * 3] += (Math.random() - 0.5) * 0.5;
          sphere[index * 3 + 1] += (Math.random() - 0.5) * 0.5;
          sphere[index * 3 + 2] += (Math.random() - 0.5) * 0.5;
        }
      }
      
      if (ref.current.geometry.attributes.position) {
        (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors={false}
          color="#00ffff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

function QuantumInterferenceWaves() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <ringGeometry args={[10, 15, 64]} />
      <meshBasicMaterial 
        color="#00ff88" 
        wireframe 
        transparent 
        opacity={0.03} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function FloatingOrbs() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[5, 5, -15]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.05} wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-5, -8, -12]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.05} wireframe />
        </mesh>
      </Float>
    </>
  );
}

export const QuantumBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none w-screen h-screen bg-[#000510]">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -50
        }}
      >
        <fog attach="fog" args={['#000510', 10, 60]} />
        <QuantumParticleField />
        <QuantumInterferenceWaves />
        <FloatingOrbs />
        <ambientLight intensity={0.5} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
};

