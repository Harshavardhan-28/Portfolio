"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";
import { terrainHeight, CRYSTAL_CENTER, mulberry32 } from "@/lib/terrain";

type Particle = {
  start: THREE.Vector3; // terrain-surface point, relative to CRYSTAL_CENTER
  target: THREE.Vector3; // crystal-local target
  isHub: boolean;
  hubIndex: number;
  birthDelay: number; // when this dot crackles alight on the terrain (0..~0.9)
  delay: number; // per-particle stagger for the convergence phase
  baseScale: number;
  brightness: number;
  jitterScale: number;
  noiseSeed: number;
};

export const SHAPE_RADIUS = 1.9;
const SEED_RADIUS = 4.2;
const BIRTH_END = 0.1; // progress fraction: dots finish crackling onto the terrain
const NOISE_END = 0.38; // progress fraction: mesh fully dissolved, convergence begins
const JITTER_MAX = 1.15;
const JITTER_MIN = 0.012;

const PARTICLES_PER_EDGE = 22;
const PARTICLES_PER_FACE = 34;
const SPARKLE_COUNT = 88;
const TOTAL = 12 + 30 * PARTICLES_PER_EDGE + 20 * PARTICLES_PER_FACE + SPARKLE_COUNT; // 1440

// three.js's IcosahedronGeometry face list, referencing the same 12-vertex
// golden-rectangle construction used below for the hubs.
const FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

type DiffusionFieldProps = {
  progress: { value: number };
  /** 0 = present, 1 = fully collapsed away. */
  exit: { value: number };
};

export default function DiffusionField({ progress, exit }: DiffusionFieldProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Group>(null);
  const instanceColorUsageSet = useRef(false);

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

    const rng = mulberry32(0xbeef);

    // Seed a particle's origin on the loss-landscape surface, center-biased
    // (the radial term in terrainHeight makes the rim much taller than the
    // basin, so a uniform square would throw most dots off-screen).
    const seedOnTerrain = () => {
      const r = SEED_RADIUS * Math.pow(rng(), 0.65);
      const a = rng() * Math.PI * 2;
      const x = r * Math.cos(a);
      const z = r * Math.sin(a);
      // Lift = wireframe overlay offset (0.01) + dot radius (0.045): sits
      // tangent to the mesh, like a bead resting on the surface.
      const y = terrainHeight(x, z) + 0.055;
      return {
        pos: new THREE.Vector3(x - CRYSTAL_CENTER.x, y - CRYSTAL_CENTER.y, z - CRYSTAL_CENTER.z),
        r,
      };
    };

    // Dots born nearer the basin (where the ball rests) crackle alight
    // first; the disintegration sweeps outward from there.
    const birthDelayFor = (r: number) =>
      THREE.MathUtils.clamp(0.72 * (r / SEED_RADIUS) + rng() * 0.18, 0, 0.9);

    const particlesArr: Particle[] = [];

    hubs.forEach((hubPos, idx) => {
      const seed = seedOnTerrain();
      particlesArr.push({
        start: seed.pos,
        target: hubPos.clone(),
        isHub: true,
        hubIndex: idx,
        birthDelay: birthDelayFor(seed.r),
        delay: rng() * 0.08,
        baseScale: 1.5,
        brightness: 1.35,
        jitterScale: 0.75,
        noiseSeed: rng() * 1000,
      });
    });

    edgeList.forEach(([a, b]) => {
      const pa = hubs[a];
      const pb = hubs[b];
      for (let j = 1; j <= PARTICLES_PER_EDGE; j++) {
        const t = j / (PARTICLES_PER_EDGE + 1);
        const seed = seedOnTerrain();
        particlesArr.push({
          start: seed.pos,
          target: new THREE.Vector3().lerpVectors(pa, pb, t),
          isHub: false,
          hubIndex: -1,
          birthDelay: birthDelayFor(seed.r),
          delay: 0.1 + rng() * 0.35,
          baseScale: 0.8,
          brightness: 1.0,
          jitterScale: 1.0,
          noiseSeed: rng() * 1000,
        });
      }
    });

    FACES.forEach(([a, b, c]) => {
      const pa = hubs[a];
      const pb = hubs[b];
      const pc = hubs[c];
      const ab = new THREE.Vector3().subVectors(pb, pa);
      const ac = new THREE.Vector3().subVectors(pc, pa);
      for (let k = 0; k < PARTICLES_PER_FACE; k++) {
        let u = rng();
        let v = rng();
        if (u + v > 1) {
          u = 1 - u;
          v = 1 - v;
        }
        const target = new THREE.Vector3().copy(pa).addScaledVector(ab, u).addScaledVector(ac, v);
        const seed = seedOnTerrain();
        particlesArr.push({
          start: seed.pos,
          target,
          isHub: false,
          hubIndex: -1,
          birthDelay: birthDelayFor(seed.r),
          delay: 0.15 + rng() * 0.4,
          baseScale: 0.55,
          // Dimmed: 680 face dots at full brightness would cross Bloom's
          // luminanceThreshold and fuse the crystal into a solid blob.
          brightness: 0.45,
          jitterScale: 1.0,
          noiseSeed: rng() * 1000,
        });
      }
    });

    for (let k = 0; k < SPARKLE_COUNT; k++) {
      const shellR = SHAPE_RADIUS * (1.1 + rng() * 0.32);
      const costheta = rng() * 2 - 1;
      const theta = Math.acos(costheta);
      const az = rng() * Math.PI * 2;
      const target = new THREE.Vector3(
        shellR * Math.sin(theta) * Math.cos(az),
        shellR * Math.sin(theta) * Math.sin(az),
        shellR * Math.cos(theta)
      );
      const seed = seedOnTerrain();
      particlesArr.push({
        start: seed.pos,
        target,
        isHub: false,
        hubIndex: -1,
        birthDelay: birthDelayFor(seed.r),
        delay: 0.2 + rng() * 0.35,
        baseScale: 0.6,
        brightness: 0.8,
        jitterScale: 1.6,
        noiseSeed: rng() * 1000,
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

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const colorSeed = useMemo(() => new THREE.Color("#0d4a1e"), []); // dim terrain-green
  const colorBright = useMemo(() => new THREE.Color("#00ff41"), []);
  const hubPositions = useMemo(() => Array.from({ length: 12 }, () => new THREE.Vector3()), []);

  // Jitter noise — a shimmer effect, doesn't need to be deterministic.
  const noiseA = useMemo(() => createNoise2D(), []);
  const noiseB = useMemo(() => createNoise2D(), []);

  useEffect(() => {
    instancedMeshRef.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame((state, delta) => {
    if (!instancedMeshRef.current || !lineRef.current || !crystalRef.current || !progress || !exit) return;

    const P = progress.value;
    const E = exit.value;

    if (E >= 0.999 || P <= 5e-4) {
      crystalRef.current.visible = false;
      if (rotationGroupRef.current) rotationGroupRef.current.rotation.y = 0;
      return;
    }
    crystalRef.current.visible = true;
    crystalRef.current.scale.setScalar(Math.max(1e-4, 1 - E));

    const birth = THREE.MathUtils.clamp(P / BIRTH_END, 0, 1);
    const scatter = THREE.MathUtils.clamp((P - 0.04) / (NOISE_END - 0.04), 0, 1);
    const conv = THREE.MathUtils.clamp((P - NOISE_END) / (1 - NOISE_END), 0, 1);
    const t = state.clock.elapsedTime;

    // The crystal only spins once it has mostly resolved — spinning from
    // birth would rotate the terrain-seeded dots off the surface they're
    // meant to be sitting on.
    const spin = THREE.MathUtils.smoothstep(conv, 0.25, 0.7);
    if (rotationGroupRef.current) rotationGroupRef.current.rotation.y += delta * 0.22 * spin;

    const mesh = instancedMeshRef.current;

    for (let i = 0; i < TOTAL; i++) {
      const p = particles[i];

      const bp = THREE.MathUtils.clamp((birth - p.birthDelay) / (1 - p.birthDelay), 0, 1);
      const bE = bp * bp * (3 - 2 * bp); // smoothstep
      const cp = THREE.MathUtils.clamp((conv - p.delay) / (1 - p.delay), 0, 1);
      const aE = 1 - Math.pow(1 - cp, 3); // easeOutCubic

      tempVec.lerpVectors(p.start, p.target, aE);

      // Chaotic jitter peaks as the mesh dissolves, decays to a residual shimmer.
      const jit = (JITTER_MIN + JITTER_MAX * scatter * Math.pow(1 - cp, 2.2)) * p.jitterScale;
      tempVec.x += jit * noiseA(p.noiseSeed, t * 0.45);
      tempVec.y += jit * noiseB(p.noiseSeed, t * 0.45);
      tempVec.z += jit * noiseA(p.noiseSeed + 411.3, t * 0.45);

      if (p.isHub) hubPositions[p.hubIndex].copy(tempVec);

      tempObject.position.copy(tempVec);
      tempObject.scale.setScalar(p.baseScale * bE * (0.85 + 0.3 * aE));
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      colorObj.lerpColors(colorSeed, colorBright, THREE.MathUtils.smoothstep(cp, 0.1, 0.85));
      colorObj.multiplyScalar(bE * (0.42 + 1.05 * aE) * p.brightness);
      mesh.setColorAt(i, colorObj);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
      if (!instanceColorUsageSet.current) {
        mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
        instanceColorUsageSet.current = true;
      }
    }

    // Wireframe stays hidden until the shape has essentially resolved, so it
    // never hints the destination early.
    const reveal = THREE.MathUtils.smoothstep(conv, 0.62, 0.96);
    lineRef.current.visible = reveal > 0.001;
    if (lineRef.current.visible) {
      const linePositions = lineRef.current.geometry.attributes.position.array as Float32Array;
      const lineColors = lineRef.current.geometry.attributes.color.array as Float32Array;

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
        lineColors[base + 1] = reveal;
        lineColors[base + 2] = 0.25 * reveal;
        lineColors[base + 3] = 0;
        lineColors[base + 4] = reveal;
        lineColors[base + 5] = 0.25 * reveal;
      });

      lineRef.current.geometry.attributes.position.needsUpdate = true;
      lineRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group ref={crystalRef} position={[CRYSTAL_CENTER.x, CRYSTAL_CENTER.y, CRYSTAL_CENTER.z]}>
      <group ref={rotationGroupRef}>
        <instancedMesh ref={instancedMeshRef} args={[nodeGeo, undefined, TOTAL]} frustumCulled={false}>
          <meshPhysicalMaterial color="#0a1a0d" emissive="#00ff41" emissiveIntensity={1} roughness={0.2} />
        </instancedMesh>

        <lineSegments ref={lineRef} geometry={edgeGeo} frustumCulled={false}>
          <lineBasicMaterial vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  );
}
