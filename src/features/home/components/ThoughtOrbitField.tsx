import { Suspense, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Float } from '@react-three/drei';
import { Color, DoubleSide, Group, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import type {
  ThoughtOrbitSectionDynamic,
  ThoughtOrbitSubsectionDynamic,
} from './ThoughtOrbitTypes';

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
  dynamics: ThoughtOrbitSectionDynamic[];
};

export const ThoughtOrbitField = ({ dynamics }: ThoughtOrbitFieldProps) => {
  const focusAverage = useMemo(() => {
    if (dynamics.length === 0) {
      return 0;
    }

    const aggregate = dynamics.reduce((total, section) => {
      const subsectionPeak = section.subsections.reduce(
        (peak, subsection) => Math.max(peak, subsection.focus),
        0,
      );
      return total + Math.max(section.focus, subsectionPeak);
    }, 0);

    return aggregate / dynamics.length;
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
          <OrbitSections sections={dynamics} />
          <CameraRig sections={dynamics} />
        </Suspense>
      </Canvas>
    </View>
  );
};

const CameraRig = ({ sections }: { sections: ThoughtOrbitSectionDynamic[] }) => {
  const { camera } = useThree();
  const sectionsRef = useRef(sections);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useFrame((state, delta) => {
    const currentSections = sectionsRef.current;
    const activeSection = currentSections.reduce<ThoughtOrbitSectionDynamic | null>(
      (previous, candidate) => {
        if (!previous || candidate.focus > previous.focus) {
          return candidate;
        }

        return previous;
      },
      null,
    );

    const activeSubsection = activeSection
      ? activeSection.subsections.reduce<ThoughtOrbitSubsectionDynamic | null>(
          (previous, candidate) => {
            if (!previous || candidate.focus > previous.focus) {
              return candidate;
            }

            return previous;
          },
          null,
        )
      : null;

    const sectionFocus = activeSection?.focus ?? 0;
    const subsectionFocus = activeSubsection?.focus ?? 0;
    const lateralBias =
      activeSection?.alignment === 'left' ? -1 : activeSection?.alignment === 'right' ? 1 : 0;
    const verticalBias =
      activeSection?.alignment === 'left' ? 0.6 : activeSection?.alignment === 'right' ? -0.6 : 0;
    const orbitRatio =
      activeSubsection && activeSubsection.count > 1
        ? activeSubsection.index / (activeSubsection.count - 1)
        : 0.5;
    const orbitSwing = (0.5 - orbitRatio) * 2;
    const orbitDrift = orbitSwing * (0.8 + subsectionFocus * 1.1);
    const distanceFactor = Math.min(Math.abs(activeSection?.distance ?? 0), 1.2);

    const targetZ = 24 - sectionFocus * 9 - subsectionFocus * 2.2 + distanceFactor * 1.4;
    const targetX = lateralBias * (sectionFocus * 5.2) + orbitDrift;
    const targetY = verticalBias * (sectionFocus * 2.4);

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

const OrbitSections = ({ sections }: { sections: ThoughtOrbitSectionDynamic[] }) => {
  return (
    <group>
      {sections.map((section, index) => (
        <OrbitSection key={section.id} section={section} index={index} total={sections.length} />
      ))}
    </group>
  );
};

type OrbitSectionProps = {
  section: ThoughtOrbitSectionDynamic;
  index: number;
  total: number;
};

type SatelliteConfig = {
  angle: number;
  radius: number;
  tilt: number;
  size: number;
  seed: number;
};

const OrbitSection = ({ section, index, total }: OrbitSectionProps) => {
  const clusterRef = useRef<Group>(null);
  const satellitesRef = useRef<Group>(null);
  const ringMaterialRef = useRef<MeshStandardMaterial>(null);
  const coreMaterialRef = useRef<MeshStandardMaterial>(null);
  const haloMaterialRef = useRef<MeshBasicMaterial>(null);
  const focusRef = useRef(section.focus);
  const activeRef = useRef<ThoughtOrbitSubsectionDynamic | null>(null);
  const rotationRef = useRef(index * 0.6);

  useEffect(() => {
    focusRef.current = section.focus;
  }, [section.focus]);

  useEffect(() => {
    const active = section.subsections.reduce<ThoughtOrbitSubsectionDynamic | null>(
      (previous, candidate) => {
        if (candidate.active) {
          return candidate;
        }

        if (!previous || candidate.focus > previous.focus) {
          return candidate;
        }

        return previous;
      },
      null,
    );

    activeRef.current = active;
  }, [section.subsections]);

  const orbitProgress = total <= 1 ? 0 : index / (total - 1);
  const baseRadius = 3.4 + orbitProgress * 2.8;
  const depth = -2.2 - orbitProgress * 2.6;
  const verticalSpread = total > 1 ? Math.min(2.9 + (total - 1) * 0.18, 3.8) : 1.4;
  const verticalOffset = (orbitProgress - 0.5) * verticalSpread * 2;
  const isHero = section.tone === 'hero';
  const baseColor = isHero ? '#60a5fa' : '#38bdf8';
  const emissiveColor = isHero ? '#1d4ed8' : '#0284c7';
  const accentColor = isHero ? '#bfdbfe' : '#7dd3fc';
  const haloRadius = isHero
    ? baseRadius * (1.12 + (1 - orbitProgress) * 0.08)
    : baseRadius * (1.03 + (1 - orbitProgress) * 0.06);

  const satellites = useMemo(
    () => createSatelliteConfigs(section.subsections.length, baseRadius, index + 1),
    [baseRadius, index, section.subsections.length],
  );

  useFrame((state, delta) => {
    const focusValue = focusRef.current;
    const active = activeRef.current;
    const activeFocus = active?.focus ?? 0;

    if (clusterRef.current) {
      const currentScale = clusterRef.current.scale.x;
      const targetScale = 0.42 + focusValue * 0.72;
      const nextScale = damp(currentScale, targetScale, 3.2, delta);
      clusterRef.current.scale.setScalar(nextScale);
      const baseSpin = 0.2 + index * 0.035;
      const pauseFactor = Math.max(0.06, 1 - Math.min(focusValue + activeFocus * 0.8, 0.92));
      clusterRef.current.rotation.y += delta * baseSpin * pauseFactor;
    }

    if (satellitesRef.current) {
      const baseOrbitSpeed = 0.24 + (1 - Math.min(focusValue, 0.9)) * 0.42;

      if (!active || activeFocus < 0.55) {
        rotationRef.current += delta * baseOrbitSpeed;
      } else {
        const count = Math.max(active.count, 1);
        const baseAngle = (active.index / count) * Math.PI * 2;
        const offset = active.offset * 0.45;
        const targetAngle = -baseAngle + offset;
        rotationRef.current = damp(rotationRef.current, targetAngle, 6.2, delta);
      }

      satellitesRef.current.rotation.y = rotationRef.current;
    }

    if (ringMaterialRef.current) {
      const nextOpacity = 0.2 + focusValue * 0.4;
      const nextEmissive = 0.38 + focusValue * 0.8;
      ringMaterialRef.current.opacity = damp(
        ringMaterialRef.current.opacity,
        nextOpacity,
        2.4,
        delta,
      );
      ringMaterialRef.current.emissiveIntensity = damp(
        ringMaterialRef.current.emissiveIntensity,
        nextEmissive,
        2.2,
        delta,
      );
    }

    if (coreMaterialRef.current) {
      const nextEmissive = 0.64 + focusValue * 1.1;
      coreMaterialRef.current.emissiveIntensity = damp(
        coreMaterialRef.current.emissiveIntensity,
        nextEmissive,
        2.2,
        delta,
      );
    }

    if (haloMaterialRef.current) {
      const nextOpacity = 0.14 + focusValue * 0.3;
      haloMaterialRef.current.opacity = damp(
        haloMaterialRef.current.opacity,
        nextOpacity,
        2.6,
        delta,
      );
    }
  });

  return (
    <group ref={clusterRef} position={[0, verticalOffset, depth]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[baseRadius, 0.18, 48, 240]} />
        <meshStandardMaterial
          ref={ringMaterialRef}
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={0.36 + section.focus * 0.9}
          transparent
          opacity={0.24 + section.focus * 0.5}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[Math.max(0.28, baseRadius * 0.12), 48, 48]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={0.78 + section.focus * 1.3}
          transparent
          opacity={0.62}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[haloRadius, 0.06, 24, 240]} />
        <meshBasicMaterial ref={haloMaterialRef} color={accentColor} transparent opacity={0.24} />
      </mesh>
      <group ref={satellitesRef}>
        {section.subsections.map((subsection, subsectionIndex) => {
          const config = satellites[subsectionIndex] ?? {
            angle: (subsectionIndex / Math.max(section.subsections.length || 1, 1)) * Math.PI * 2,
            radius: baseRadius * 0.92,
            tilt: 0,
            size: 0.3,
            seed: subsectionIndex,
          };

          return (
            <OrbitSatellite
              key={subsection.id}
              config={config}
              subsection={subsection}
              tone={section.tone}
            />
          );
        })}
      </group>
    </group>
  );
};

type OrbitSatelliteProps = {
  config: SatelliteConfig;
  subsection: ThoughtOrbitSubsectionDynamic;
  tone: ThoughtOrbitSectionDynamic['tone'];
};

const OrbitSatellite = ({ config, subsection, tone }: OrbitSatelliteProps) => {
  const containerRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const surfaceRef = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const ringMaterialRef = useRef<MeshBasicMaterial>(null);
  const highlightMaterialRef = useRef<MeshBasicMaterial>(null);
  const focusRef = useRef(subsection.focus);
  const activeRef = useRef(subsection.active);
  const spreadRef = useRef(subsection.spread);
  const driftRef = useRef(subsection.offset);
  const surfaceMaterialRef = useRef<MeshStandardMaterial>(null);

  useEffect(() => {
    focusRef.current = subsection.focus;
    activeRef.current = subsection.active;
    spreadRef.current = subsection.spread;
    driftRef.current = subsection.offset;
  }, [subsection.active, subsection.focus, subsection.offset, subsection.spread]);

  const baseColor = tone === 'hero' ? '#bfdbfe' : '#7dd3fc';
  const emissiveColor = tone === 'hero' ? '#2563eb' : '#0ea5e9';
  const ringColor = tone === 'hero' ? '#22d3ee' : '#38bdf8';

  useFrame((state, delta) => {
    const focusValue = focusRef.current;
    const isActive = activeRef.current;
    const spread = spreadRef.current;
    const drift = driftRef.current;

    if (containerRef.current) {
      const targetTilt = config.tilt + drift * 0.04;
      const targetAzimuth = config.angle + drift * 1.3;
      containerRef.current.rotation.x = damp(
        containerRef.current.rotation.x,
        targetTilt,
        2.6,
        delta,
      );
      containerRef.current.rotation.y = damp(
        containerRef.current.rotation.y,
        targetAzimuth,
        3.4,
        delta,
      );
    }

    if (bodyRef.current) {
      const currentScale = bodyRef.current.scale.x;
      const targetScale = isActive ? 0.6 + focusValue * 0.9 : 0.32 + focusValue * 0.5;
      const nextScale = damp(currentScale, targetScale, 4.2, delta);
      bodyRef.current.scale.setScalar(nextScale);
      const targetRadius = config.radius * (0.82 + spread * 0.28);
      const horizontalShift = drift * 0.9;
      bodyRef.current.position.x = damp(bodyRef.current.position.x, targetRadius, 3.4, delta);
      bodyRef.current.position.z = damp(bodyRef.current.position.z, horizontalShift, 3, delta);
    }

    if (materialRef.current) {
      const flattening = isActive ? Math.min(1, Math.max(0, focusValue - 0.35) * 1.6) : 0;
      const targetOpacity = isActive ? 0.24 + (1 - flattening) * 0.38 : 0.2 + focusValue * 0.3;
      const targetEmissive = isActive ? 0.7 + (1 - flattening * 0.6) * 1 : 0.5 + focusValue * 0.9;
      materialRef.current.opacity = damp(materialRef.current.opacity, targetOpacity, 3.2, delta);
      materialRef.current.emissiveIntensity = damp(
        materialRef.current.emissiveIntensity,
        targetEmissive,
        3,
        delta,
      );
    }

    if (ringMaterialRef.current) {
      const targetOpacity = isActive ? 0.3 + focusValue * 0.4 : 0.08 + focusValue * 0.18;
      ringMaterialRef.current.opacity = damp(
        ringMaterialRef.current.opacity,
        targetOpacity,
        3,
        delta,
      );
    }

    if (highlightMaterialRef.current) {
      const targetOpacity = isActive ? 0.26 + focusValue * 0.5 : 0;
      highlightMaterialRef.current.opacity = damp(
        highlightMaterialRef.current.opacity,
        targetOpacity,
        4,
        delta,
      );
    }

    if (surfaceRef.current && surfaceMaterialRef.current) {
      const activation = Math.max(0, Math.min(1, focusValue * 1.1 - 0.2));
      const expansion = isActive ? 0.4 + activation * 1.6 : activation * 0.9;
      const scaleVector = surfaceRef.current.scale as unknown as {
        x: number;
        y: number;
        z: number;
        set: (x: number, y: number, z: number) => void;
      };
      const nextWidth = damp(scaleVector.x, expansion * 1.8, 4, delta);
      const nextHeight = damp(scaleVector.y, expansion * 1.1, 3.6, delta);
      const nextDepth = damp(scaleVector.z, Math.max(0.24, expansion * 0.9), 4, delta);
      scaleVector.set(nextWidth, nextHeight, nextDepth);
      const planeOffset = isActive ? -0.62 - activation * 0.8 : -0.28;
      surfaceRef.current.position.x = damp(
        surfaceRef.current.position.x,
        config.radius * 1.02,
        3,
        delta,
      );
      surfaceRef.current.position.z = damp(surfaceRef.current.position.z, planeOffset, 3.6, delta);
      surfaceMaterialRef.current.opacity = damp(
        surfaceMaterialRef.current.opacity,
        Math.min(0.86, activation * 0.9),
        4.2,
        delta,
      );
      surfaceMaterialRef.current.emissiveIntensity = damp(
        surfaceMaterialRef.current.emissiveIntensity,
        0.4 + activation * 1.4,
        3.6,
        delta,
      );
    }
  });

  return (
    <group ref={containerRef} rotation={[config.tilt, config.angle, 0]}>
      <group ref={bodyRef} position={[config.radius, 0, 0]}>
        <mesh>
          <sphereGeometry args={[config.size * 0.6, 32, 32]} />
          <meshStandardMaterial
            ref={materialRef}
            color={baseColor}
            emissive={emissiveColor}
            emissiveIntensity={0.58 + subsection.focus * 1.1}
            transparent
            opacity={0.24 + subsection.focus * 0.3}
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[config.size * 0.52, 0.02, 16, 64]} />
          <meshBasicMaterial
            ref={ringMaterialRef}
            color={ringColor}
            transparent
            opacity={0.12 + subsection.focus * 0.22}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[config.size * 0.74, 0.015, 24, 80]} />
          <meshBasicMaterial ref={highlightMaterialRef} color={ringColor} transparent opacity={0} />
        </mesh>
      </group>
      <group
        ref={surfaceRef}
        position={[config.radius * 1.02, 0, -0.28]}
        scale={[0.001, 0.001, 0.001]}
      >
        <mesh rotation={[-Math.PI / 9, 0, 0]}>
          <planeGeometry args={[config.size * 5.4, config.size * 3.1, 1, 1]} />
          <meshStandardMaterial
            ref={surfaceMaterialRef}
            color={tone === 'hero' ? '#172554' : '#0f172a'}
            emissive={tone === 'hero' ? '#3b82f6' : '#0ea5e9'}
            emissiveIntensity={0.3}
            transparent
            opacity={0}
            metalness={0.18}
            roughness={0.68}
            side={DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

const createSatelliteConfigs = (
  count: number,
  baseRadius: number,
  seed: number,
): SatelliteConfig[] => {
  if (count <= 0) {
    return [];
  }

  return new Array(count).fill(null).map((_, index) => {
    const baseSeed = seed * 97 + index * 53;
    const radius = baseRadius * (0.68 + pseudoRandom(baseSeed) * 0.18);
    const tilt = (pseudoRandom(baseSeed + 1) - 0.5) * 0.48;
    const size = 0.24 + pseudoRandom(baseSeed + 2) * 0.28;
    const angle = (index / count) * Math.PI * 2;

    return {
      angle,
      radius,
      tilt,
      size,
      seed: baseSeed,
    };
  });
};

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};
