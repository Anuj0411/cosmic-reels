import { useEffect, useMemo, type FC } from "react";
import { Points } from "@react-three/drei";
import { AdditiveBlending } from "three";
import { STAR } from "../lib/math";
import { createStarTextures } from "../lib/starSprite";
import { fillBox } from "../lib/stars";

const wrapZ = (z: number, min: number, span: number, shift: number) => {
  const t = (((z - min + shift) % span) + span) % span;
  return min + t;
};

const flyLayer = (
  source: Float32Array,
  t: number,
  speed: number,
  zMin: number,
  zSpan: number,
  radial: number,
) => {
  const next = new Float32Array(source.length);
  for (let i = 0; i < source.length / 3; i += 1) {
    const z = wrapZ(source[i * 3 + 2], zMin, zSpan, t * speed);
    const closeness = (z - zMin) / zSpan;
    const spread = 1 + closeness * radial;
    next[i * 3] = source[i * 3] * spread;
    next[i * 3 + 1] = source[i * 3 + 1] * spread;
    next[i * 3 + 2] = z;
  }
  return next;
};

export const TravelStars: FC<{
  seed: string;
  t: number;
  pixelScale?: number;
}> = ({ seed, t, pixelScale = 1 }) => {
  const sprites = useMemo(() => createStarTextures(), []);
  const dust = useMemo(() => fillBox(4200, [8.8, 15.2, 4.2], `${seed}-dust`), [seed]);
  const field = useMemo(() => fillBox(1700, [8.0, 13.8, 4.0], `${seed}-field`), [seed]);
  const bright = useMemo(() => fillBox(260, [6.8, 12.0, 3.4], `${seed}-bright`), [seed]);

  const dustPositions = useMemo(
    () => flyLayer(dust, t, 2.8, 0.48, 3.05, 0.16),
    [dust, t],
  );
  const fieldPositions = useMemo(
    () => flyLayer(field, t, 6.1, 0.62, 2.85, 0.4),
    [field, t],
  );
  const brightPositions = useMemo(
    () => flyLayer(bright, t, 9.6, 0.95, 2.45, 0.62),
    [bright, t],
  );

  useEffect(() => {
    return () => {
      sprites.disc.dispose();
      sprites.spike.dispose();
    };
  }, [sprites]);

  return (
    <group>
      <Points positions={dustPositions} stride={3} frustumCulled={false}>
        <pointsMaterial
          transparent
          color={STAR}
          map={sprites.disc}
          size={2.8 * pixelScale}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest={false}
          opacity={0.7}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </Points>
      <Points positions={fieldPositions} stride={3} frustumCulled={false}>
        <pointsMaterial
          transparent
          color={STAR}
          map={sprites.disc}
          size={5.2 * pixelScale}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest={false}
          opacity={0.86}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </Points>
      <Points positions={brightPositions} stride={3} frustumCulled={false}>
        <pointsMaterial
          transparent
          color={STAR}
          map={sprites.disc}
          size={14 * pixelScale}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest={false}
          opacity={0.28}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </Points>
      <Points positions={brightPositions} stride={3} frustumCulled={false}>
        <pointsMaterial
          transparent
          color={STAR}
          map={sprites.spike}
          size={9.4 * pixelScale}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest={false}
          opacity={0.95}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </Points>
    </group>
  );
};
