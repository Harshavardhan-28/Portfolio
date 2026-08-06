"use client";

import { useMemo, useRef, forwardRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";

const LossLandscape = forwardRef<THREE.Group, { progress: { value: number } }>(({ progress }, ref) => {
  const ballRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Line>(null);

  const SIZE = 10;
  const SEGMENTS = 128;

  const { geometry, curve, trailGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const noise2D = createNoise2D();

    let minHeight = Infinity;
    let minIdx = -1;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 1.2 * noise2D(x * 0.15, z * 0.15) +
              0.5 * noise2D(x * 0.4, z * 0.4) +
              0.2 * noise2D(x * 1.0, z * 1.0);

      // Radial falloff fallback to ensure a basin forms in the center
      // Adding distance squared forces the center to be lower than the edges
      const distSq = x * x + z * z;
      y += distSq * 0.15; 

      pos.setY(i, y);

      if (y < minHeight) {
        minHeight = y;
        minIdx = i;
      }
    }

    geo.computeVertexNormals();

    const targetX = pos.getX(minIdx);
    const targetZ = pos.getZ(minIdx);

    // Helper for continuous gradient sampling
    const getHeight = (vx: number, vz: number) => {
      let y = 1.2 * noise2D(vx * 0.15, vz * 0.15) +
              0.5 * noise2D(vx * 0.4, vz * 0.4) +
              0.2 * noise2D(vx * 1.0, vz * 1.0);
      y += (vx * vx + vz * vz) * 0.15;
      return y;
    };

    const waypoints: THREE.Vector3[] = [];
    
    // Start at a high ridge
    let currentX = -4.5;
    let currentZ = -4.5;
    let currentY = getHeight(currentX, currentZ);

    waypoints.push(new THREE.Vector3(currentX, currentY + 0.05, currentZ));

    const learningRate = 0.12;
    const epsilon = 0.01;
    const numSteps = 45;

    for (let step = 0; step < numSteps; step++) {
      const hX1 = getHeight(currentX + epsilon, currentZ);
      const hX2 = getHeight(currentX - epsilon, currentZ);
      const hZ1 = getHeight(currentX, currentZ + epsilon);
      const hZ2 = getHeight(currentX, currentZ - epsilon);

      const gradX = (hX1 - hX2) / (2 * epsilon);
      const gradZ = (hZ1 - hZ2) / (2 * epsilon);

      currentX -= gradX * learningRate;
      currentZ -= gradZ * learningRate;

      currentX = Math.max(-SIZE/2, Math.min(SIZE/2, currentX));
      currentZ = Math.max(-SIZE/2, Math.min(SIZE/2, currentZ));

      currentY = getHeight(currentX, currentZ);
      
      // Wobble effect: slight overshoot in trajectory near the end
      if (step > 30) {
        currentX += (Math.random() - 0.5) * 0.05;
        currentZ += (Math.random() - 0.5) * 0.05;
      }
      
      waypoints.push(new THREE.Vector3(currentX, currentY + 0.05, currentZ));
    }

    // Force absolute minimum as the final resting point
    waypoints.push(new THREE.Vector3(targetX, minHeight + 0.05, targetZ));

    // Create a smooth continuous path through waypoints
    const catmullRom = new THREE.CatmullRomCurve3(waypoints);
    
    // Pre-allocate trail geometry
    const trailPoints = 100;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailPoints * 3);
    const trailColors = new Float32Array(trailPoints * 3);
    
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    trailGeo.setDrawRange(0, 0);

    return { geometry: geo, curve: catmullRom, trailGeometry: trailGeo };
  }, []);

  const ballGeo = useMemo(() => new THREE.SphereGeometry(0.08, 16, 16), []);
  let frameCount = 0;

  useFrame(() => {
    if (!ballRef.current || !trailRef.current || !progress) return;

    const p = progress.value;
    
    if (p >= 0 && p <= 1) {
      const pos = curve.getPointAt(p);
      ballRef.current.position.copy(pos);
    }

    // Throttle trail updates to every 2nd frame to save performance
    frameCount++;
    if (frameCount % 2 !== 0) return;

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
          colors[count * 3] = 0;     // R
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
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>
      
      <mesh geometry={geometry} position-y={0.01}>
        <meshBasicMaterial 
          color="#00ff41" 
          wireframe={true} 
          transparent={true} 
          opacity={0.35} 
        />
      </mesh>

      <mesh ref={ballRef} geometry={ballGeo}>
        <meshPhysicalMaterial 
          color="#00ff41" 
          emissive="#00ff41" 
          emissiveIntensity={2} 
          roughness={0.2} 
        />
      </mesh>

      {/* 'line' as any used to bypass TypeScript conflict with SVG <line> */}
      {(() => {
        const TrailLine = 'line' as any;
        return (
          <TrailLine ref={trailRef} geometry={trailGeometry}>
            <lineBasicMaterial vertexColors={true} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
          </TrailLine>
        );
      })()}
    </group>
  );
});

LossLandscape.displayName = "LossLandscape";
export default LossLandscape;
