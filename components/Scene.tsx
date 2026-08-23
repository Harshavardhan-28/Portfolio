'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import LossLandscape from './LossLandscape';
import DiffusionField, { SHAPE_RADIUS } from './DiffusionField';
import { CRYSTAL_CENTER } from '@/lib/terrain';

gsap.registerPlugin(ScrollTrigger);

const CAM_Z = 6;
const FOV_DEG = 50;

function MLSceneContent() {
  const sharedGroupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Mutable state objects for GSAP to tween.
  const descentState = useRef({ value: 0 });
  const diffusionState = useRef({ value: 0 });
  const terrainFade = useRef({ value: 1 });
  const exitState = useRef({ value: 0 });

  const aspect = size.width / size.height;
  const layoutKey = size.width < 768 ? 'sm' : 'lg';

  useGSAP(() => {
    const g = sharedGroupRef.current;
    if (!g) return;

    // The crystal should fill roughly the same fraction of the frame on any
    // aspect ratio — narrower/taller viewports need it pulled closer to camera.
    const halfTan = Math.tan((FOV_DEG * Math.PI) / 180 / 2);
    const hNeed = (SHAPE_RADIUS * 1.15) / Math.min(1, aspect);
    const targetZ = THREE.MathUtils.clamp(CAM_Z - hNeed / halfTan, -4.5, 1.6);

    gsap.set(g.position, { x: 0, y: 0, z: 0 });
    gsap.set(g.scale, { x: 1, y: 1, z: 1 });
    descentState.current.value = 0;
    diffusionState.current.value = 0;
    terrainFade.current.value = 1;
    exitState.current.value = 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        // Tied to the Experience section's bottom (not the page bottom) so the
        // whole crystal timeline — including its exit/disappear stage — always
        // resolves by the time Experience ends, instead of smearing the exit
        // across whatever sections follow (Social, Footer).
        endTrigger: '#experience',
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

    tl.to(g.position, {
      x: 3.5,
      y: -0.5,
      z: 0,
      duration: 2,
      ease: 'power1.inOut',
    }, 0);

    // --- STAGE 2: About to Projects (terrain disintegrates into the diffusion field) ---
    // Linear: this is a scrubbed physical process, not an eased UI transition —
    // an eased curve here is what previously hid the entire noise phase.
    tl.to(diffusionState.current, {
      value: 1,
      duration: 2.6,
      ease: 'none',
    }, 2.0);

    // The mesh dissolves partway through the noising phase, once dots have
    // already crackled alight across its surface.
    tl.to(terrainFade.current, {
      value: 0,
      duration: 0.85,
      ease: 'power1.in',
    }, 2.25);

    // Recenter onto the crystal's nucleation point (the terrain's minimum)
    // before the fade completes, so the dissolve plays out on-screen.
    tl.to(g.position, {
      x: -CRYSTAL_CENTER.x,
      y: -CRYSTAL_CENTER.y,
      duration: 1.2,
      ease: 'power2.inOut',
    }, 2.0);

    // Held back until convergence is well underway: terrain-seeded particles
    // that haven't converged yet carry the terrain's full depth range, and
    // pulling the camera in while that spread is still wide puts stray
    // particles almost on top of the camera (huge perspective blow-up).
    tl.to(g.position, {
      z: targetZ - CRYSTAL_CENTER.z,
      duration: 0.7,
      ease: 'power1.inOut',
    }, 4.0);

    // --- STAGE 3: End of Projects Carousel (Disappear) ---
    tl.to(exitState.current, {
      value: 1,
      duration: 0.5,
      ease: 'power2.in',
    }, 5.0);

  }, [layoutKey]);

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.25}>
      <group ref={sharedGroupRef}>
        <LossLandscape progress={descentState.current} fade={terrainFade.current} />
        <DiffusionField progress={diffusionState.current} exit={exitState.current} />
      </group>
    </Float>
  );
}

export default function Scene() {
  // Bloom/AA/high-DPR rendering is the most GPU-hungry part of the page —
  // phones and tablets get a lighter render path so the scroll-tied
  // animations stay smooth instead of dropping frames.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, CAM_Z], fov: FOV_DEG }}
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
            intensity={isMobile ? 0.9 : 1.2}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            mipmapBlur={!isMobile}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
