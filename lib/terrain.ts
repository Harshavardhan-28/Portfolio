// Shared, deterministic loss-landscape definition.
//
// Both LossLandscape (which renders the mesh) and DiffusionField (which seeds its
// particles onto that mesh's surface) import from here, so they agree on one
// identical terrain. Seeding the noise also makes the landscape stable across
// reloads instead of regenerating randomly on every mount.

import { createNoise2D } from "simplex-noise";

export const TERRAIN_SIZE = 10;
export const TERRAIN_SEGMENTS = 128;
export const BALL_LIFT = 0.05;

const TERRAIN_SEED = 1337;

/** Small deterministic PRNG — same seed always yields the same stream. */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// This PRNG instance is consumed building the permutation table — don't reuse it.
const noise2D = createNoise2D(mulberry32(TERRAIN_SEED));

/**
 * Height of the loss surface at (x, z). The radial term forces a basin in the
 * middle so gradient descent always has somewhere to roll to.
 */
export function terrainHeight(x: number, z: number): number {
  return (
    1.2 * noise2D(x * 0.15, z * 0.15) +
    0.5 * noise2D(x * 0.4, z * 0.4) +
    0.2 * noise2D(x * 1.0, z * 1.0) +
    (x * x + z * z) * 0.15
  );
}

/** Global minimum, found over the same lattice PlaneGeometry tessellates. */
export const TERRAIN_MIN = (() => {
  const step = TERRAIN_SIZE / TERRAIN_SEGMENTS;
  const half = TERRAIN_SIZE / 2;

  let best = { x: 0, y: Infinity, z: 0 };
  for (let ix = 0; ix <= TERRAIN_SEGMENTS; ix++) {
    const x = -half + ix * step;
    for (let iz = 0; iz <= TERRAIN_SEGMENTS; iz++) {
      const z = -half + iz * step;
      const y = terrainHeight(x, z);
      if (y < best.y) best = { x, y, z };
    }
  }
  return best;
})();

/** Where the ball comes to rest — and therefore where the crystal nucleates. */
export const CRYSTAL_CENTER = {
  x: TERRAIN_MIN.x,
  y: TERRAIN_MIN.y + BALL_LIFT,
  z: TERRAIN_MIN.z,
};
