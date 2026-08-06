"use client";

import { useMemo, useRef, forwardRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";

type Particle = {
  start: THREE.Vector3;
  target: THREE.Vector3;
  isHub: boolean;
  isSparkle: boolean;
  hubIndex: number;
  delay: number;
  noiseSeed: number;
};

const PARTICLES_PER_EDGE = 19;
const SPARKLE_COUNT = 18;
const SHAPE_RADIUS = 1.4;
const NOISE_RADIUS = 4.5;

// Uniform-density random point inside a sphere (cube-root radius distribution)
function randomPointInBall(radius: number) {
  const r = radius * Math.cbrt(Math.random());
  const costheta = Math.random() * 2 - 1;
  const theta = Math.acos(costheta);
  const az = Math.random() * Math.PI * 2;
  return new THREE.Vector3(
    r * Math.sin(theta) * Math.cos(az),
    r * Math.sin(theta) * Math.sin(az),
    r * Math.cos(theta)
  );
}

function randomPointOnShell(rMin: number, rMax: number) {
  const r = rMin + Math.random() * (rMax - rMin);
  const costheta = Math.random() * 2 - 1;
  const theta = Math.acos(costheta);
  const az = Math.random() * Math.PI * 2;
  return new THREE.Vector3(
    r * Math.sin(theta) * Math.cos(az),
    r * Math.sin(theta) * Math.sin(az),
    r * Math.cos(theta)
  );
}

const DiffusionField = forwardRef<THREE.Group, { progress: { value: number } }>(({ progress }, ref) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);

  const { particles, edges, edgeGeo, nodeGeo } = useMemo(() => {
    // Icosahedron: 12 vertices via the golden-rectangle construction
    const phi = (1 + Math.sqrt(5)) / 2;
    const raw = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    const hubs = raw.map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize().multiplyScalar(SHAPE_RADIUS));

    // Derive the 30 true edges by nearest-neighbor distance thresholding
    let minDist = Infinity;
    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const d = hubs[i].distanceTo(hubs[j]);
        if (d < minDist) minDist = d;
      }
    }
    const edgeList: [number, number][] = [];
    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        if (hubs[i].distanceTo(hubs[j]) <= minDist * 1.05) {
          edgeList.push([i, j]);
        }
      }
    }

    const particlesArr: Particle[] = [];

    hubs.forEach((hubPos, idx) => {
      particlesArr.push({
        start: randomPointInBall(NOISE_RADIUS),
        target: hubPos.clone(),
        isHub: true,
        isSparkle: false,
        hubIndex: idx,
        delay: Math.random() * 0.15,
        noiseSeed: Math.random() * 1000,
      });
    });

    edgeList.forEach(([a, b]) => {
      const pa = hubs[a];
      const pb = hubs[b];
      for (let j = 1; j <= PARTICLES_PER_EDGE; j++) {
        const t = j / (PARTICLES_PER_EDGE + 1);
        particlesArr.push({
          start: randomPointInBall(NOISE_RADIUS),
          target: new THREE.Vector3().lerpVectors(pa, pb, t),
          isHub: false,
          isSparkle: false,
          hubIndex: -1,
          delay: Math.random() * 0.35,
          noiseSeed: Math.random() * 1000,
        });
      }
    });

    for (let k = 0; k < SPARKLE_COUNT; k++) {
      particlesArr.push({
        start: randomPointInBall(NOISE_RADIUS),
        target: randomPointOnShell(SHAPE_RADIUS * 1.15, SHAPE_RADIUS * 1.6),
        isHub: false,
        isSparkle: true,
        hubIndex: -1,
        delay: Math.random() * 0.35,
        noiseSeed: Math.random() * 1000,
      });
    }

    const edgePositions = new Float32Array(edgeList.length * 6);
    const edgeColors = new Float32Array(edgeList.length * 6);
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    eGeo.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));

    const nGeo = new THREE.SphereGeometry(0.045, 6, 6);

    return { particles: particlesArr, edges: edgeList, edgeGeo: eGeo, nodeGeo: nGeo };
  }, []);

  const totalParticles = particles.length;
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const colorDark = useMemo(() => new THREE.Color("#0a1a0d"), []);
  const colorBright = useMemo(() => new THREE.Color("#00ff41"), []);
  const colorRim = useMemo(() => new THREE.Color("#3399ff"), []);
  const hubPositions = useMemo(() => Array.from({ length: 12 }, () => new THREE.Vector3()), []);

  const noiseX = useMemo(() => createNoise2D(), []);
  const noiseY = useMemo(() => createNoise2D(), []);
  const noiseZ = useMemo(() => createNoise2D(), []);

  useFrame((state, delta) => {
    if (!instancedMeshRef.current || !lineRef.current || !progress) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < totalParticles; i++) {
      const p = particles[i];
      const raw = THREE.MathUtils.clamp((progress.value - p.delay) / (1 - p.delay), 0, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      const arrive = p.isSparkle ? eased * 0.3 : eased;

      tempVec.lerpVectors(p.start, p.target, arrive);

      // Chaotic jitter fades out as the particle settles into place
      const jitterAmp = THREE.MathUtils.lerp(0.35, 0.03, eased);
      tempVec.x += jitterAmp * noiseX(p.noiseSeed, t * 0.5);
      tempVec.y += jitterAmp * noiseY(p.noiseSeed, t * 0.5);
      tempVec.z += jitterAmp * noiseZ(p.noiseSeed, t * 0.5);

      if (p.isHub) hubPositions[p.hubIndex].copy(tempVec);

      tempObject.position.copy(tempVec);
      const baseScale = p.isHub ? 1.5 : p.isSparkle ? 0.6 : 0.8;
      tempObject.scale.setScalar(baseScale * (0.85 + 0.15 * Math.sin(eased * Math.PI)));
      tempObject.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, tempObject.matrix);

      const intensity = 0.3 + eased * 2.2;
      colorObj.lerpColors(colorDark, colorBright, eased);
      if (p.isHub) colorObj.lerp(colorRim, 0.12);
      colorObj.r *= intensity;
      colorObj.g *= intensity;
      colorObj.b *= intensity;
      instancedMeshRef.current.setColorAt(i, colorObj);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    instancedMeshRef.current.instanceColor!.needsUpdate = true;

    // Wireframe crystallizes in step with overall progress, not per-particle easing
    const linePositions = lineRef.current.geometry.attributes.position.array as Float32Array;
    const lineColors = lineRef.current.geometry.attributes.color.array as Float32Array;
    const lineIntensity = 0.05 + progress.value * 0.95;

    edges.forEach(([a, b], idx) => {
      const posA = hubPositions[a];
      const posB = hubPositions[b];
      const base = idx * 6;
      linePositions[base] = posA.x;
      linePositions[base + 1] = posA.y;
      linePositions[base + 2] = posA.z;
      linePositions[base + 3] = posB.x;
      linePositions[base + 4] = posB.y;
      linePositions[base + 5] = posB.z;

      lineColors[base] = 0;
      lineColors[base + 1] = lineIntensity;
      lineColors[base + 2] = 0.25 * lineIntensity;
      lineColors[base + 3] = 0;
      lineColors[base + 4] = lineIntensity;
      lineColors[base + 5] = 0.25 * lineIntensity;
    });

    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.geometry.attributes.color.needsUpdate = true;

    if (rotationGroupRef.current) rotationGroupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={ref}>
      <group ref={rotationGroupRef}>
        <instancedMesh ref={instancedMeshRef} args={[nodeGeo, undefined, totalParticles]}>
          <meshPhysicalMaterial
            color="#0a1a0d"
            emissive="#ffffff"
            emissiveIntensity={1}
            roughness={0.2}
          />
        </instancedMesh>

        <lineSegments ref={lineRef} geometry={edgeGeo}>
          <lineBasicMaterial
            vertexColors={true}
            transparent={true}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
});

DiffusionField.displayName = "DiffusionField";
export default DiffusionField;
