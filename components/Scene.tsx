'use client';

import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import LossLandscape from './LossLandscape';
import DiffusionField from './DiffusionField';

gsap.registerPlugin(ScrollTrigger);

function MLSceneContent() {
  const terrainGroupRef = useRef<THREE.Group>(null);
  const diffusionGroupRef = useRef<THREE.Group>(null);

  // Mutable state objects for GSAP to tween.
  const descentState = useRef({ value: 0 });
  const diffusionState = useRef({ value: 0 });

  useGSAP(() => {
    if (!terrainGroupRef.current || !diffusionGroupRef.current) return;

    // Initially hide the diffusion field
    gsap.set(diffusionGroupRef.current.scale, { x: 0, y: 0, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // --- STAGE 1: Hero to About (Descent & Move Right) ---
    tl.to(descentState.current, {
      value: 1,
      duration: 2,
      ease: 'power1.inOut',
    }, 0);

    tl.to(terrainGroupRef.current.position, {
      x: 3.5,
      y: -0.5,
      z: 0,
      duration: 2,
      ease: 'power1.inOut',
    }, 0);

    // --- STAGE 2: About to Projects (Diffusion Field takes over) ---
    // Hide terrain smoothly
    tl.to(terrainGroupRef.current.scale, {
      x: 0, y: 0, z: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 2);

    // Scale container to a modest size (1.5x)
    tl.to(diffusionGroupRef.current.scale, {
      x: 1.5, y: 1.5, z: 1.5,
      duration: 1,
      ease: 'power2.inOut',
    }, 2);

    tl.to(diffusionGroupRef.current.position, {
      x: 0,
      y: 0,
      z: -5,
      duration: 3,
      ease: 'power2.inOut',
    }, 2);

    tl.to(diffusionState.current, {
      value: 1,
      duration: 3,
      ease: 'power2.out', // Fast while scattered, decelerating as particles settle into form
    }, 2);

    // --- STAGE 3: End of Projects Carousel (Disappear) ---
    tl.to(diffusionGroupRef.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 4.5);

    tl.to(diffusionGroupRef.current.position, {
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 4.5);

  }, []);

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <LossLandscape ref={terrainGroupRef} progress={descentState.current} />
      </Float>

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <DiffusionField ref={diffusionGroupRef} progress={diffusionState.current} />
      </Float>
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />

        {/* Key Light (Green Highlight from top-right) */}
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={50}
          color="#00ff41"
        />

        {/* Rim Light (cool backlight from bottom-left) */}
        <spotLight
          position={[-10, -10, -5]}
          intensity={100}
          color="blue"
        />

        <MLSceneContent />

        <Environment preset="city" />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
