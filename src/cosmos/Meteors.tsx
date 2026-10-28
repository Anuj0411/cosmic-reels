import { useMemo, type FC } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { random } from "remotion";
import { STAR } from "../lib/math";

type Meteor = {
  start: number;
  life: number;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
};

const TRAIL = 10;

export const Meteors: FC<{
  seed: string;
  frame: number;
  fps: number;
  count?: number;
  volume?: "flight" | "nebula";
  pixelScale?: number;
}> = ({ seed, frame, fps, count = 16, volume = "flight", pixelScale = 1 }) => {
  const meteors = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const nebula = volume === "nebula";
      const start = nebula
        ? Math.floor((index / count) * fps * 13 + random(`${seed}-ms-${index}`) * 10)
        : Math.floor(random(`${seed}-ms-${index}`) * fps * 12);
      const life = nebula
        ? 26 + Math.floor(random(`${seed}-ml-${index}`) * 16)
        : 18 + Math.floor(random(`${seed}-ml-${index}`) * 16);
      return {
        start,
        life,
        x: nebula
          ? (random(`${seed}-mx-${index}`) - 0.5) * 2.6
          : (random(`${seed}-mx-${index}`) - 0.5) * 16,
        y: nebula
          ? (random(`${seed}-my-${index}`) - 0.5) * 4.4
          : 4 + random(`${seed}-my-${index}`) * 6,
        z: nebula
          ? 2.4 + random(`${seed}-mz-${index}`) * 3.4
          : (random(`${seed}-mz-${index}`) - 0.5) * 18,
        dx: nebula
          ? -0.055 - random(`${seed}-mdx-${index}`) * 0.05
          : -0.35 - random(`${seed}-mdx-${index}`) * 0.25,
        dy: nebula
          ? -0.12 - random(`${seed}-mdy-${index}`) * 0.08
          : -0.55 - random(`${seed}-mdy-${index}`) * 0.35,
        dz: nebula
          ? 0.035 + random(`${seed}-mdz-${index}`) * 0.04
          : 0.15 + random(`${seed}-mdz-${index}`) * 0.2,
      } satisfies Meteor;
    });
  }, [count, fps, seed, volume]);

  const nebula = volume === "nebula";

  return (
    <group>
      {meteors.map((meteor, meteorIndex) => {
        const local = frame - meteor.start;
        if (local < 0 || local > meteor.life) {
          return null;
        }

        const head = local / meteor.life;
        const positions = new Float32Array(TRAIL * 3);
        for (let i = 0; i < TRAIL; i += 1) {
          const back = (i / (TRAIL - 1)) * 1.8;
          const p = head - back / meteor.life;
          positions[i * 3] = meteor.x + meteor.dx * p * meteor.life;
          positions[i * 3 + 1] = meteor.y + meteor.dy * p * meteor.life;
          positions[i * 3 + 2] = meteor.z + meteor.dz * p * meteor.life;
        }

        return (
          <Points
            key={`${seed}-meteor-${meteorIndex}`}
            positions={positions}
            stride={3}
            frustumCulled={false}
          >
            <PointMaterial
              transparent
              color={STAR}
              size={nebula ? 11 * pixelScale : 0.045}
              sizeAttenuation={!nebula}
              depthWrite={false}
              depthTest={!nebula}
              opacity={nebula ? 1 : 0.95 * (1 - head)}
            />
          </Points>
        );
      })}
    </group>
  );
};
