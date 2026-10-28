import { useMemo, type FC } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { DUST } from "../lib/math";
import { fillBox } from "../lib/stars";

export const DustLane: FC<{
  seed: string;
  count: number;
  t: number;
  pulse: number;
}> = ({ seed, count, t, pulse }) => {
  const positions = useMemo(
    () => fillBox(count, [18, 2.4, 46], `${seed}-dust`),
    [count, seed],
  );

  const clearing = Math.max(0, (t - 0.78) / 0.22);

  return (
    <group rotation={[0.12 + t * 0.04, 0.2 + t * 0.28, 0.08]}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={DUST}
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          opacity={0.22 * (1 - clearing * 0.7) * (1 + pulse * 0.55)}
        />
      </Points>
    </group>
  );
};
