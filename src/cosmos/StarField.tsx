import { useMemo, type FC } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { STAR } from "../lib/math";
import { fillBox } from "../lib/stars";

export const StarField: FC<{
  seed: string;
  count: number;
  t: number;
  pulse: number;
}> = ({ seed, count, t, pulse }) => {
  const positions = useMemo(
    () => fillBox(count, [22, 18, 46], `${seed}-stars`),
    [count, seed],
  );

  const clearing = Math.max(0, (t - 0.78) / 0.22);

  return (
    <group rotation={[t * 0.15, t * 0.55, 0]}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={STAR}
          size={0.018 + pulse * 0.028}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85 * (1 - clearing * 0.45) * (1 + pulse * 0.45)}
        />
      </Points>
    </group>
  );
};
