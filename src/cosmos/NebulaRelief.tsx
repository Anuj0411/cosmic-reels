import type { FC } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { poseForFlight, type Flight } from "../lib/flights";
import type { NebulaAsset } from "./useNebulaAsset";

export const NebulaRelief: FC<{
  asset: NebulaAsset;
  t: number;
  zoom: number;
  flight: Flight;
  focusX: number;
  focusY: number;
  bank: number;
}> = ({ asset, t, zoom, flight, focusX, focusY, bank }) => {
  const { camera, gl } = useThree();
  asset.texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
  const pose = poseForFlight({
    flight,
    t,
    zoom,
    planeWidth: asset.planeWidth,
    planeHeight: asset.planeHeight,
    focusX,
    focusY,
  });
  const roll = pose.roll + bank * t;

  camera.position.set(...pose.position);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...pose.lookAt);
  camera.updateProjectionMatrix();

  return (
    <mesh geometry={asset.geometry}>
      <meshBasicMaterial
        map={asset.texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
