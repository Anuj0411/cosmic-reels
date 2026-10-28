import { useMemo, type FC } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { FIRE } from "../lib/math";
import { fillDisk } from "../lib/stars";

export const BlackHole: FC<{
  seed: string;
  frame: number;
  fps: number;
}> = ({ seed, frame, fps }) => {
  const rest = useMemo(
    () => fillDisk(2200, 1.15, 4.2, `${seed}-disk`),
    [seed],
  );

  const positions = useMemo(() => {
    const next = new Float32Array(rest.length);
    const time = frame / fps;
    for (let i = 0; i < rest.length / 3; i += 1) {
      const x = rest[i * 3];
      const y = rest[i * 3 + 1];
      const z = rest[i * 3 + 2];
      const radius = Math.max(0.35, Math.hypot(x, z));
      const spin = time * (1.1 / radius);
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);
      next[i * 3] = x * cos - z * sin;
      next[i * 3 + 1] = y;
      next[i * 3 + 2] = x * sin + z * cos;
    }
    return next;
  }, [frame, fps, rest]);

  return (
    <group position={[0, 0, -1.5]} rotation={[0.55, 0.15, 0]}>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial
          color="#1a1020"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={FIRE}
          size={0.045}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  );
};
