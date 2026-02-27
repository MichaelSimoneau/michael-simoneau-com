import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

// --- Configuration ---
const MAX_NEBULAS = 7;
const INITIAL_NEBULAS = 3;
const LIGHTNING_LIFETIME = 0.2; // seconds
const CHARGE_RATE = 0.3; // charge per second
const DISCHARGE_THRESHOLD = 5.0; // Charge required to potentially arc
const NEBULA_SPEED = 0.3;
const BOUNDS = 20;

interface NebulaData {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  charge: number;
  seed: number;
}

interface LightningData {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  createdAt: number;
}

// --- Components ---

const Sparks: React.FC<{ charge: number; scale: number }> = ({ charge, scale }) => {
  const ref = useRef<THREE.Points>(null!);
  const [positions] = useState(() => {
    const pos = new Float32Array(150 * 3); // 150 sparks per cloud
    return random.inSphere(pos, { radius: 1 }) as Float32Array;
  });

  useFrame((state, delta) => {
    if (ref.current && ref.current.material) {
        // Flicker intensity based on charge
        const baseOpacity = Math.min(charge * 0.1, 0.8);
        (ref.current.material as THREE.PointsMaterial).opacity = baseOpacity + (Math.random() * 0.2);
        
        // Rotate slowly
        ref.current.rotation.y += delta * 0.1;
        ref.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#88ccff"
        size={0.15 * scale}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const Nebula: React.FC<{ data: NebulaData }> = ({ data }) => {
  const groupRef = useRef<THREE.Group>(null!);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- useFrame callback signature
  useFrame((_state, _delta) => {
    if (groupRef.current) {
      // Smooth movement updates are handled by parent state, 
      // but we can add local turbulence here if needed.
      groupRef.current.position.lerp(data.position, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={data.position}>
      {/* Dark Cloud Layers */}
      <Cloud
        opacity={0.3}
        speed={0.1} // Slow internal rotation
        bounds={5 * data.scale}
        volume={1.5}
        segments={10}
        color="#050510" // Very dark blue/black
      />
      <Cloud
        opacity={0.2}
        speed={0.1}
        bounds={4 * data.scale}
        volume={2}
        segments={5}
        color="#101020" // Slightly lighter core
        position={[0, 0, 1]}
      />
      
      {/* Internal Charge Sparks */}
      <group scale={[data.scale * 2, data.scale * 2, data.scale * 2]}>
        <Sparks charge={data.charge} scale={data.scale} />
      </group>
    </group>
  );
};

const LightningArc: React.FC<{ data: LightningData }> = ({ data }) => {
  const lineRef = useRef<any>(null);
  const [geometry] = useState(() => new THREE.BufferGeometry());
  const LineTag = 'line' as any;
  
  useFrame((_state) => {
    const age = _state.clock.elapsedTime - data.createdAt;
    if (age > LIGHTNING_LIFETIME) return;

    // Animate opacity out
    if (lineRef.current && lineRef.current.material) {
       const life = 1 - (age / LIGHTNING_LIFETIME);
       (lineRef.current.material as THREE.LineBasicMaterial).opacity = life;
    }

    // Jitter the line slightly every frame for "electricity" look
    if (lineRef.current) {
        const points = generateLightningPoints(data.start, data.end, 10, 1.5);
        geometry.setFromPoints(points);
    }
  });

  return (
    <LineTag ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#aaddff" 
        transparent 
        opacity={1} 
        blending={THREE.AdditiveBlending} 
        linewidth={2} 
      />
    </LineTag>
  );
};

// Helper to create jagged line points
function generateLightningPoints(start: THREE.Vector3, end: THREE.Vector3, segments: number, jitter: number) {
  const points: THREE.Vector3[] = [start];
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  dir.normalize();

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const pos = new THREE.Vector3().copy(start).add(dir.clone().multiplyScalar(len * t));
    
    // Add random jitter perpendicular to direction (simplified)
    pos.x += (Math.random() - 0.5) * jitter;
    pos.y += (Math.random() - 0.5) * jitter;
    pos.z += (Math.random() - 0.5) * jitter;
    
    points.push(pos);
  }
  points.push(end);
  return points;
}

const StormScene: React.FC = () => {
  // State managed via stateRef for frame-loop updates; setTick forces re-renders on topology change
  
  // Refs for frame loop updates to avoid react render cycle thrashing for physics
  // However, we need to render the components, so we sync state periodically or use refs for positions?
  // For < 10 objects, React state is fine for position updates if we don't update every frame, 
  // but for smooth animation usually we update refs.
  // Here, we'll keep state for the *list* of objects, but perhaps update positions in a ref-based manager?
  // Actually, let's use a "Manager" component that handles the logic and updates a ref-store, 
  // triggering re-renders only when topology changes (spawn/death).
  // BUT, moving positions need to be reflected.
  // Let's stick to standard React state for topology + refs for high-freq updates? 
  // Or just update state every frame? 
  // For 10 objects, updating state every frame is acceptable in React 18 usually.
  
  // Let's use a ref for the *data* and a `useFrame` to update it, 
  // and `useState` only to force re-render when objects are added/removed.
  // This is a common pattern for particle systems in React.
  
  const stateRef = useRef<{
    nebulas: NebulaData[];
    lightnings: LightningData[];
    lastUpdate: number;
  }>({
    nebulas: [],
    lightnings: [],
    lastUpdate: 0
  });
  
  // Force update trigger
  const [, setTick] = useState(0);

  // Initialize
  useEffect(() => {
    const initialNebulas: NebulaData[] = [];
    for (let i = 0; i < INITIAL_NEBULAS; i++) {
      initialNebulas.push({
        id: Math.random().toString(36).substr(2, 9),
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5 - 5 // push back a bit
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * NEBULA_SPEED,
          (Math.random() - 0.5) * NEBULA_SPEED,
          (Math.random() - 0.5) * NEBULA_SPEED * 0.2
        ),
        scale: 1 + Math.random(),
        charge: Math.random() * 2,
        seed: Math.random()
      });
    }
    stateRef.current.nebulas = initialNebulas;
    setTick(t => t + 1);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const { nebulas, lightnings } = stateRef.current;
    let topologyChanged = false;

    // 1. Update Nebulas
    nebulas.forEach(neb => {
      // Move
      neb.position.add(neb.velocity.clone().multiplyScalar(delta));
      
      // Bounce bounds
      if (Math.abs(neb.position.x) > BOUNDS) neb.velocity.x *= -1;
      if (Math.abs(neb.position.y) > BOUNDS/1.5) neb.velocity.y *= -1;
      if (neb.position.z > 5 || neb.position.z < -20) neb.velocity.z *= -1;

      // Charge up
      neb.charge += CHARGE_RATE * delta;
    });

    // 2. Cleanup old lightning
    const activeLightnings = lightnings.filter(l => time - l.createdAt < LIGHTNING_LIFETIME);
    if (activeLightnings.length !== lightnings.length) {
      stateRef.current.lightnings = activeLightnings;
      topologyChanged = true;
    }

    // 3. Try to discharge
    // Find pairs that are close enough and charged enough
    if (Math.random() < 0.1) { // Check occasionally, not every frame
        for (let i = 0; i < nebulas.length; i++) {
            for (let j = i + 1; j < nebulas.length; j++) {
                const a = nebulas[i];
                const b = nebulas[j];
                
                if (a.charge > DISCHARGE_THRESHOLD && b.charge > DISCHARGE_THRESHOLD) {
                    const dist = a.position.distanceTo(b.position);
                    if (dist < 15) { // Range check
                         // DISCHARGE!
                         if (Math.random() < 0.5) { // Random chance even if conditions met
                             // Create Lightning
                             stateRef.current.lightnings.push({
                                 id: Math.random().toString(),
                                 start: a.position.clone(),
                                 end: b.position.clone(),
                                 createdAt: time
                             });

                             // Reset Charge
                             a.charge = 0;
                             b.charge = 0;
                             
                             // Spawn new nebula?
                             if (nebulas.length < MAX_NEBULAS && Math.random() < 0.3) {
                                 const midPoint = new THREE.Vector3().addVectors(a.position, b.position).multiplyScalar(0.5);
                                 stateRef.current.nebulas.push({
                                     id: Math.random().toString(),
                                     position: midPoint,
                                     velocity: new THREE.Vector3(
                                         (Math.random() - 0.5) * NEBULA_SPEED,
                                         (Math.random() - 0.5) * NEBULA_SPEED,
                                         0
                                     ),
                                     scale: 0.5, // Start small
                                     charge: 0,
                                     seed: Math.random()
                                 });
                             }
                             
                             topologyChanged = true;
                         }
                    }
                }
            }
        }
    }

    // Grow new nebulas
    nebulas.forEach(n => {
        if (n.scale < 1.5) n.scale += delta * 0.2;
    });

    if (topologyChanged) {
        setTick(t => t + 1);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4444ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#ff00ff" />
      
      {stateRef.current.nebulas.map(neb => (
        <Nebula key={neb.id} data={neb} />
      ))}
      
      {stateRef.current.lightnings.map(light => (
        <LightningArc key={light.id} data={light} />
      ))}
    </group>
  );
};

export const NebulaStormBackground: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`inset-0 -z-50 bg-[#000510] ${className || "fixed w-screen h-screen"}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        }}
        gl={{ antialias: false, alpha: false }}
      >
        <color attach="background" args={['#000510']} />
        <fog attach="fog" args={['#000510', 10, 50]} />
        <StormScene />
      </Canvas>
      {/* Overlay noise/vignette if desired */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};

