"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { terrainHeight, TERRAIN_MIN, TERRAIN_SIZE, TERRAIN_SEGMENTS, BALL_LIFT, mulberry32 } from "@/lib/terrain";

type LossLandscapeProps = {
  progress: { value: number };
  /** 1 = fully visible, 0 = dissolved away (drives material opacity, not scale). */
  fade: { value: number };
};

export default function LossLandscape({ progress, fade }: LossLandscapeProps) {
  const rootRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Line>(null);

  const baseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ballMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const trailMatRef = useRef<THREE.LineBasicMaterial>(null);

  const lastP = useRef(-1);
  let frameCount = 0;

  const { geometry, curve, trailGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)));
    }
    geo.computeVertexNormals();

    // Deterministic wobble stream, independent from the terrain's own noise stream.
    const wob = mulberry32(0xc0ffee);

    const waypoints: THREE.Vector3[] = [];

    // Start at a high ridge
    let currentX = -4.5;
    let currentZ = -4.5;
    let currentY = terrainHeight(currentX, currentZ);

    waypoints.push(new THREE.Vector3(currentX, currentY + 0.05, currentZ));

    const learningRate = 0.12;
    const epsilon = 0.01;
    const numSteps = 45;

    for (let step = 0; step < numSteps; step++) {
      const hX1 = terrainHeight(currentX + epsilon, currentZ);
      const hX2 = terrainHeight(currentX - epsilon, currentZ);
      const hZ1 = terrainHeight(currentX, currentZ + epsilon);
      const hZ2 = terrainHeight(currentX, currentZ - epsilon);

      const gradX = (hX1 - hX2) / (2 * epsilon);
      const gradZ = (hZ1 - hZ2) / (2 * epsilon);

      currentX -= gradX * learningRate;
      currentZ -= gradZ * learningRate;

      currentX = Math.max(-TERRAIN_SIZE / 2, Math.min(TERRAIN_SIZE / 2, currentX));
      currentZ = Math.max(-TERRAIN_SIZE / 2, Math.min(TERRAIN_SIZE / 2, currentZ));

      currentY = terrainHeight(currentX, currentZ);

      // Wobble effect: slight overshoot in trajectory near the end
      if (step > 30) {
        currentX += (wob() - 0.5) * 0.05;
        currentZ += (wob() - 0.5) * 0.05;
      }

      waypoints.push(new THREE.Vector3(currentX, currentY + 0.05, currentZ));
    }

    // Force the shared global minimum as the final resting point
    waypoints.push(new THREE.Vector3(TERRAIN_MIN.x, TERRAIN_MIN.y + BALL_LIFT, TERRAIN_MIN.z));

    const catmullRom = new THREE.CatmullRomCurve3(waypoints);

    const trailPoints = 100;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailPoints * 3);
    const trailColors = new Float32Array(trailPoints * 3);

    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));
    trailGeo.setDrawRange(0, 0);

    return { geometry: geo, curve: catmullRom, trailGeometry: trailGeo };
  }, []);

  const ballGeo = useMemo(() => new THREE.SphereGeometry(0.08, 16, 16), []);

  useFrame(() => {
    if (!rootRef.current || !ballRef.current || !trailRef.current || !progress || !fade) return;

    const f = fade.value;
    rootRef.current.visible = f > 0.004;
    if (!rootRef.current.visible) return;

    if (baseMatRef.current) baseMatRef.current.opacity = f;
    if (wireMatRef.current) wireMatRef.current.opacity = 0.35 * f;

    // The ball (the optimizer's answer) outlives the mesh, fading out last.
    const ballF = THREE.MathUtils.clamp(f * 1.8, 0, 1);
    if (ballMatRef.current) {
      ballMatRef.current.opacity = ballF;
      ballMatRef.current.emissiveIntensity = 2 * ballF;
    }
    if (trailMatRef.current) trailMatRef.current.opacity = 0.8 * f;

    const p = progress.value;

    if (p >= 0 && p <= 1) {
      ballRef.current.position.copy(curve.getPointAt(p));
    }

    // Throttle trail updates to every 2nd frame, and skip entirely once the
    // descent has finished and progress stops changing (it's pinned at 1).
    frameCount++;
    if (frameCount % 2 !== 0) return;
    if (Math.abs(p - lastP.current) < 5e-4) return;
    lastP.current = p;

    const trailGeo = trailRef.current.geometry;
    const positions = trailGeo.attributes.position.array as Float32Array;
    const colors = trailGeo.attributes.color.array as Float32Array;

    const numPoints = 80;
    const trailLength = 0.25;
    const startP = Math.max(0, p - trailLength);

    if (p > 0) {
      let count = 0;
      for (let i = 0; i < numPoints; i++) {
        const pointProgress = startP + (p - startP) * (i / (numPoints - 1));
        if (pointProgress <= p) {
          const pointPos = curve.getPointAt(pointProgress);
          positions[count * 3] = pointPos.x;
          positions[count * 3 + 1] = pointPos.y;
          positions[count * 3 + 2] = pointPos.z;

          // Trail fades out along its length
          const intensity = Math.pow(i / (numPoints - 1), 2);
          colors[count * 3] = 0; // R
          colors[count * 3 + 1] = 1 * intensity; // G
          colors[count * 3 + 2] = 0.25 * intensity; // B
          count++;
        }
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;
      trailGeo.setDrawRange(0, count);
    } else {
      trailGeo.setDrawRange(0, 0);
    }
  });

  return (
    <group ref={rootRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial ref={baseMatRef} color="#0a0a0a" roughness={0.8} metalness={0.1} transparent />
      </mesh>

      <mesh geometry={geometry} position-y={0.01}>
        <meshBasicMaterial ref={wireMatRef} color="#00ff41" wireframe transparent opacity={0.35} />
      </mesh>

      <mesh ref={ballRef} geometry={ballGeo}>
        <meshPhysicalMaterial ref={ballMatRef} color="#00ff41" emissive="#00ff41" emissiveIntensity={2} roughness={0.2} transparent />
      </mesh>

      {/* 'line' as any used to bypass TypeScript conflict with SVG <line> */}
      {(() => {
        const TrailLine = "line" as any;
        return (
          <TrailLine ref={trailRef} geometry={trailGeometry}>
            <lineBasicMaterial ref={trailMatRef} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
          </TrailLine>
        );
      })()}
    </group>
  );
}
