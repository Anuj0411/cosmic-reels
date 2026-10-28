import { random } from "remotion";

export const fillBox = (
  count: number,
  [sx, sy, sz]: [number, number, number],
  seed: string,
) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (random(`${seed}-x-${i}`) - 0.5) * sx;
    positions[i * 3 + 1] = (random(`${seed}-y-${i}`) - 0.5) * sy;
    positions[i * 3 + 2] = (random(`${seed}-z-${i}`) - 0.5) * sz;
  }
  return positions;
};

export const fillDisk = (
  count: number,
  inner: number,
  outer: number,
  seed: string,
) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = random(`${seed}-a-${i}`) * Math.PI * 2;
    const radius = inner + random(`${seed}-r-${i}`) * (outer - inner);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (random(`${seed}-y-${i}`) - 0.5) * 0.12;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return positions;
};
