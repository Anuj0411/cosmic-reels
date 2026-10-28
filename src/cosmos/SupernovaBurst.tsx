import type { FC } from "react";
import { interpolate, Easing } from "remotion";
import { CORE, FIRE, STAR } from "../lib/math";

export const SupernovaBurst: FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const ignite = Math.round(fps * 1.4);
  const peak = ignite + Math.round(fps * 0.7);
  const fade = ignite + Math.round(fps * 3.2);

  const flash = interpolate(frame, [ignite, peak, fade], [0, 1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shell = interpolate(frame, [ignite, fade], [0.08, 16], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const core = interpolate(frame, [ignite, peak, fade], [0.2, 1.8, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < ignite) {
    return null;
  }

  return (
    <group position={[0.4, 0.2, -2]}>
      <mesh scale={core}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={CORE}
          transparent
          opacity={0.95 * flash}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={shell * 0.35}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={FIRE}
          transparent
          opacity={0.35 * flash}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={shell}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={STAR}
          wireframe
          transparent
          opacity={0.55 * flash}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
