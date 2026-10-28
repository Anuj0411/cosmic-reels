import * as THREE from "three";
import { smoothstep } from "./math";

export const flights = [
  "push",
  "pull",
  "orbit",
  "rise",
  "punch",
  "track",
  "glide",
] as const;

export type Flight = (typeof flights)[number];

export type CameraPose = {
  position: [number, number, number];
  lookAt: [number, number, number];
  roll: number;
};

const ease = (t: number) => THREE.MathUtils.lerp(t, smoothstep(t), 0.55);

export const poseForFlight = ({
  flight,
  t,
  zoom,
  planeWidth,
  planeHeight,
  focusX,
  focusY,
}: {
  flight: Flight;
  t: number;
  zoom: number;
  planeWidth: number;
  planeHeight: number;
  focusX: number;
  focusY: number;
}): CameraPose => {
  const e = ease(t);
  const lookX = focusX * planeWidth * 0.22;
  const lookY = focusY * planeHeight * 0.22;
  const close = 9.1 / Math.max(1.15, zoom);

  if (flight === "pull") {
    const camZ = THREE.MathUtils.lerp(close, 9.4, e);
    return {
      position: [lookX, lookY + 0.05, camZ],
      lookAt: [lookX, lookY, 0],
      roll: (0.5 - e) * 0.05,
    };
  }

  if (flight === "orbit") {
    const angle = e * 0.62;
    const radius = THREE.MathUtils.lerp(8.7, 6.5, e);
    return {
      position: [
        lookX + Math.sin(angle) * radius * 0.28,
        lookY + 0.12,
        Math.cos(angle) * radius,
      ],
      lookAt: [lookX, lookY, 0],
      roll: Math.sin(e * Math.PI) * 0.06,
    };
  }

  if (flight === "rise") {
    const y0 = lookY - planeHeight * 0.16;
    const y1 = lookY + planeHeight * 0.18;
    const y = THREE.MathUtils.lerp(y0, y1, e);
    const camZ = THREE.MathUtils.lerp(8.9, close + 0.4, e);
    return {
      position: [lookX, y + 0.04, camZ],
      lookAt: [lookX, y, 0],
      roll: 0.02,
    };
  }

  if (flight === "punch") {
    const punch = e * e * (3 - 2 * e);
    const camZ = THREE.MathUtils.lerp(15.4, Math.min(close, 6.1), punch);
    return {
      position: [lookX, lookY + 0.03, camZ],
      lookAt: [lookX, lookY, 0],
      roll: punch * 0.03,
    };
  }

  if (flight === "track") {
    const x = THREE.MathUtils.lerp(
      lookX - planeWidth * 0.16,
      lookX + planeWidth * 0.14,
      e,
    );
    const y = THREE.MathUtils.lerp(
      lookY - planeHeight * 0.05,
      lookY + planeHeight * 0.1,
      e,
    );
    const camZ = THREE.MathUtils.lerp(7.2, close + 0.35, e);
    return {
      position: [x, y + 0.04, camZ],
      lookAt: [x, y, 0],
      roll: -0.08 + e * 0.12,
    };
  }

  if (flight === "glide") {
    const x = THREE.MathUtils.lerp(
      lookX - planeWidth * 0.2,
      lookX + planeWidth * 0.18,
      e,
    );
    const camZ = THREE.MathUtils.lerp(8.5, close + 0.35, e);
    return {
      position: [x, lookY + 0.02, camZ],
      lookAt: [x, lookY, 0],
      roll: 0,
    };
  }

  const camZ = THREE.MathUtils.lerp(9.1, close, e);
  const yaw = Math.sin(e * Math.PI) * 0.09;
  return {
    position: [lookX + Math.sin(yaw) * camZ * 0.045, lookY + 0.04, camZ],
    lookAt: [lookX, lookY, 0],
    roll: (e - 0.5) * 0.04,
  };
};
