import { Suspense, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Float } from '@react-three/drei';
import { Color, DoubleSide, Group, MeshStandardMaterial } from 'three';
import type { ThoughtOrbitDynamicState } from './ThoughtOrbitTypes';

const styles = StyleSheet.create({
  canvasContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
});

const damp = (value: number, target: number, smoothing: number, delta: number) => {
  if (smoothing <= 0) {
    return target;
  }

  const factor = 1 - Math.exp(-smoothing * delta);
  return value + (target - value) * factor;
};

export type ThoughtOrbitFieldProps = {
  dynamics: ThoughtOrbitDynamicState[];
};

export const ThoughtOrbitField = ({ dynamics }: ThoughtOrbitFieldProps) => {
  const focusAverage = useMemo(() => {
    if (dynamics.length === 0) {
      return 0;
    }

    return dynamics.reduce((total, current) => total + current.focus, 0) / dynamics.length;
  }, [dynamics]);

  return (
    <View style={styles.canvasContainer}>
      <Canvas
        style={StyleSheet.absoluteFillObject}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.18} color="#0f172a" />
          <pointLight position={[0, 0, 18]} intensity={1.8} color="#38bdf8" distance={60} />
          <pointLight position={[-6, -4, -12]} intensity={0.7} color="#f0abfc" distance={40} />
          <StarField />
          <NebulaMist focus={focusAverage} />
          <OrbitClusters dynamics={dynamics} />
          <CameraRig dynamics={dynamics} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const CameraRig = ({ dynamics }: ThoughtOrbitFieldProps) => {
  const { camera } = useThree();
  const dynamicsRef = useRef(dynamics);

  useEffect(() => {
    dynamicsRef.current = dynamics;
  }, [dynamics]);

  useFrame((state, delta) => {
    const currentDynamics = dynamicsRef.current;
    const active = currentDynamics.reduce<ThoughtOrbitDynamicState | null>(
      (previous, candidate) => {
        if (!previous || candidate.focus > previous.focus) {
          return candidate;
        }

        return previous;
      },
      null,
    );

    const activeFocus = active?.focus ?? 0;
    const lateralBias = active
      ? active.alignment === 'left'
        ? -1
        : active.alignment === 'right'
          ? 1
          : 0
      : 0;
    const verticalBias = active
      ? active.alignment === 'center'
        ? 0
        : active.alignment === 'left'
          ? 0.6
          : -0.6
      : 0;

    const targetZ = 24 - activeFocus * 9 + (active?.distance ?? 0.6) * 1.8;
    const targetX = lateralBias * (activeFocus * 5.2);
    const targetY = verticalBias * (activeFocus * 2.4);

    camera.position.z = damp(camera.position.z, targetZ, 2.6, delta);
    camera.position.x = damp(camera.position.x, targetX, 3.1, delta);
    camera.position.y = damp(camera.position.y, targetY, 2.4, delta);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
};

const StarField = () => {
  const pointGroup = useRef<Group>(null);
  const positions = useMemo(() => {
    const count = 720;
    const positionArray = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const radius = 22 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);

      positionArray[index * 3] = radius * Math.cos(theta) * sinPhi;
      positionArray[index * 3 + 1] = radius * Math.sin(theta) * sinPhi;
      positionArray[index * 3 + 2] = radius * Math.cos(phi);
    }

    return positionArray;
  }, []);

  useFrame((state, delta) => {
    if (!pointGroup.current) {
      return;
    }

    pointGroup.current.rotation.y += delta * 0.02;
    pointGroup.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.08;
  });

  return (
    <group ref={pointGroup}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={new Color('#0f1a2b')}
          size={0.45}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const NebulaMist = ({ focus }: { focus: number }) => {
  const mistRef = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const focusRef = useRef(focus);

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useFrame((state, delta) => {
    if (mistRef.current) {
      mistRef.current.rotation.y += delta * 0.06;
      mistRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.22;
    }

    if (materialRef.current) {
      const targetOpacity = 0.12 + focusRef.current * 0.28;
      const targetEmissive = 0.35 + focusRef.current * 0.9;

      materialRef.current.opacity = damp(materialRef.current.opacity, targetOpacity, 1.6, delta);
      materialRef.current.emissiveIntensity = damp(
        materialRef.current.emissiveIntensity,
        targetEmissive,
        1.8,
        delta,
      );
    }
  });

  return (
    <group ref={mistRef} position={[0, -1.2, -8]}>
      <Float speed={0.6} rotationIntensity={0.22} floatIntensity={0.38}>
        <mesh>
          <sphereGeometry args={[7.6, 48, 48]} />
          <meshStandardMaterial
            ref={materialRef}
            color="#0b1120"
            emissive="#0ea5e9"
            transparent
            opacity={0.18 + focus * 0.22}
            emissiveIntensity={0.48 + focus * 0.7}
            roughness={0.8}
            metalness={0.1}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Float>
    </group>
  );
};

const OrbitClusters = ({ dynamics }: ThoughtOrbitFieldProps) => {
  return (
    <group>
      {dynamics.map((dynamic, index) => (
        <OrbitConstellation
          key={dynamic.id}
          dynamic={dynamic}
          index={index}
          total={dynamics.length}
        />
      ))}
    </group>
  );
};

type OrbitConstellationProps = {
  dynamic: ThoughtOrbitDynamicState;
  index: number;
  total: number;
};

type SatelliteConfig = {
  radius: number;
  tilt: number;
  phase: number;
  size: number;
  seed: number;
};

const OrbitConstellation = ({ dynamic, index, total }: OrbitConstellationProps) => {
  const clusterRef = useRef<Group>(null);
  const satellitesRef = useRef<Group>(null);
  const orbitMaterialRef = useRef<MeshStandardMaterial>(null);
  const scaleRef = useRef(0.42 + dynamic.focus * 0.72);
  const targetScaleRef = useRef(scaleRef.current);
  const focusRef = useRef(dynamic.focus);

  useEffect(() => {
    targetScaleRef.current = 0.42 + dynamic.focus * 0.72;
    focusRef.current = dynamic.focus;
  }, [dynamic.focus]);

  const baseRadius = 4 + index * 1.9;
  const depth = -index * 3.4 - 2.2;
  const verticalOffset = (index - (total - 1) / 2) * 2.1;
  const isFeatured = dynamic.id.includes('featured');
  const baseColor = dynamic.tone === 'hero' ? '#60a5fa' : '#38bdf8';
  const emissiveColor = dynamic.tone === 'hero' ? '#1d4ed8' : '#0284c7';
  const accentColor = dynamic.tone === 'hero' ? '#bfdbfe' : '#7dd3fc';
  const haloRadius = isFeatured ? baseRadius * 1.2 : baseRadius * 1.05;

  const satellites = useMemo(
    () => createSatellites(isFeatured ? 7 : 5, baseRadius, index + 1),
    [baseRadius, index, isFeatured],
  );

  useFrame((state, delta) => {
    const focusValue = focusRef.current;

    if (clusterRef.current) {
      clusterRef.current.rotation.y += delta * (0.2 + index * 0.035);
      const nextScale = damp(scaleRef.current, targetScaleRef.current, 3.2, delta);
      scaleRef.current = nextScale;
      clusterRef.current.scale.setScalar(nextScale);
    }

    if (satellitesRef.current) {
      satellitesRef.current.rotation.y -= delta * (0.28 + focusValue * 0.52);
    }

    if (orbitMaterialRef.current) {
      const nextOpacity = 0.2 + focusValue * 0.6;
      const nextEmissive = 0.28 + focusValue * 1.2;
      orbitMaterialRef.current.opacity = damp(
        orbitMaterialRef.current.opacity,
        nextOpacity,
        2.4,
        delta,
      );
      orbitMaterialRef.current.emissiveIntensity = damp(
        orbitMaterialRef.current.emissiveIntensity,
        nextEmissive,
        2.2,
        delta,
      );
    }
  });

  return (
    <group ref={clusterRef} position={[0, verticalOffset, depth]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[baseRadius, 0.18, 48, 240]} />
        <meshStandardMaterial
          ref={orbitMaterialRef}
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={0.36 + dynamic.focus * 0.9}
          transparent
          opacity={0.24 + dynamic.focus * 0.5}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[Math.max(0.28, baseRadius * 0.12), 48, 48]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={0.78 + dynamic.focus * 1.3}
          transparent
          opacity={0.62}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[haloRadius, 0.06, 24, 240]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.24 + dynamic.focus * 0.44} />
      </mesh>
      <group ref={satellitesRef}>
        {satellites.map((satellite) => (
          <group key={satellite.seed} rotation={[satellite.tilt, satellite.phase, 0]}>
            <mesh position={[satellite.radius, 0, 0]}>
              <sphereGeometry args={[satellite.size * 0.6, 32, 32]} />
              <meshStandardMaterial
                color={accentColor}
                emissive={emissiveColor}
                emissiveIntensity={0.58 + dynamic.focus * 1.1}
                metalness={0.2}
                roughness={0.4}
              />
            </mesh>
            {isFeatured ? (
              <group rotation={[0, satellite.phase * 0.4, 0]}>
                <mesh position={[satellite.radius * 0.42, 0, 0]}>
                  <sphereGeometry args={[satellite.size * 0.32, 24, 24]} />
                  <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#0891b2"
                    emissiveIntensity={0.9 + dynamic.focus * 1.4}
                  />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[satellite.radius * 0.42, 0, 0]}>
                  <torusGeometry args={[satellite.size * 0.48, 0.02, 16, 64]} />
                  <meshBasicMaterial
                    color="#22d3ee"
                    transparent
                    opacity={0.32 + dynamic.focus * 0.4}
                  />
                </mesh>
              </group>
            ) : null}
          </group>
        ))}
      </group>
    </group>
  );
};

const createSatellites = (count: number, baseRadius: number, seed: number): SatelliteConfig[] => {
  return new Array(count).fill(null).map((_, index) => {
    const baseSeed = seed * 97 + index * 53;
    const radius = baseRadius * (0.48 + pseudoRandom(baseSeed) * 0.42);
    const tilt = (pseudoRandom(baseSeed + 1) - 0.5) * 0.8;
    const phase = pseudoRandom(baseSeed + 2) * Math.PI * 2;
    const size = 0.32 + pseudoRandom(baseSeed + 3) * 0.38;

    return {
      radius,
      tilt,
      phase,
      size,
      seed: baseSeed,
    };
  });
};

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};
