import * as THREE from "three";

const paintDisc = (context: CanvasRenderingContext2D, size: number, inner: number) => {
  const cx = size / 2;
  const cy = size / 2;
  const glow = context.createRadialGradient(cx, cy, 0, cx, cy, size * 0.48);
  glow.addColorStop(0, "rgba(255, 255, 255, 1)");
  glow.addColorStop(inner, "rgba(232, 238, 248, 0.7)");
  glow.addColorStop(0.42, "rgba(232, 238, 248, 0.12)");
  glow.addColorStop(1, "rgba(232, 238, 248, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, size, size);
};

const paintSpike = (
  context: CanvasRenderingContext2D,
  size: number,
  angle: number,
  length: number,
  width: number,
) => {
  const cx = size / 2;
  const cy = size / 2;
  context.save();
  context.translate(cx, cy);
  context.rotate(angle);
  const fade = context.createLinearGradient(-length, 0, length, 0);
  fade.addColorStop(0, "rgba(255, 255, 255, 0)");
  fade.addColorStop(0.5, "rgba(255, 255, 255, 0.72)");
  fade.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = fade;
  context.fillRect(-length, -width / 2, length * 2, width);
  context.restore();
};

const canvasTexture = (size: number, paint: (context: CanvasRenderingContext2D) => void) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not paint star sprite");
  }
  paint(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

export const createStarTextures = () => {
  const disc = canvasTexture(64, (context) => {
    paintDisc(context, 64, 0.16);
  });
  const spike = canvasTexture(128, (context) => {
    paintDisc(context, 128, 0.12);
    context.globalCompositeOperation = "lighter";
    paintSpike(context, 128, 0, 60, 1.5);
    paintSpike(context, 128, Math.PI / 2, 60, 1.5);
    paintSpike(context, 128, Math.PI / 4, 28, 0.8);
    paintSpike(context, 128, -Math.PI / 4, 28, 0.8);
  });
  return { disc, spike };
};
