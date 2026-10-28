import type { FC } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep } from "../lib/math";

export const CameraFlight: FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const eased = smoothstep(t);
  const camZ = THREE.MathUtils.lerp(11, -8, eased);
  const pathX = Math.sin(eased * Math.PI) * 0.55;
  const pathY = 0.12 + eased * 0.4;

  camera.position.set(pathX, pathY, camZ);
  camera.lookAt(pathX, pathY, camZ - 4);
  camera.updateProjectionMatrix();

  return null;
};
