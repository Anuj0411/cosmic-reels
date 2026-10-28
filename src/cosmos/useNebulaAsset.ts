import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDelayRender } from "remotion";
import * as THREE from "three";
import { clamp01 } from "../lib/math";
import type { Still } from "../lib/stills";

const PLANE_HEIGHT = 6.2;
const SEGMENTS = 280;
const DEPTH_MAP = 512;

export type NebulaAsset = {
  texture: THREE.Texture;
  geometry: THREE.PlaneGeometry;
  planeWidth: number;
  planeHeight: number;
};

const blurLuma = (source: Float32Array, size: number, radius: number): Float32Array => {
  const temp = new Float32Array(source.length);
  const out = new Float32Array(source.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let sum = 0;
      let count = 0;
      for (let dx = -radius; dx <= radius; dx += 1) {
        const sx = Math.min(size - 1, Math.max(0, x + dx));
        sum += source[y * size + sx];
        count += 1;
      }
      temp[y * size + x] = sum / count;
    }
  }
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let sum = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const sy = Math.min(size - 1, Math.max(0, y + dy));
        sum += temp[sy * size + x];
        count += 1;
      }
      out[y * size + x] = sum / count;
    }
  }
  return out;
};

const enhanceStill = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not enhance still");
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.filter = "contrast(1.06) saturate(1.05) brightness(1.02)";
  context.drawImage(image, 0, 0);
  return canvas;
};

const bakeRelief = (
  image: CanvasImageSource,
  width: number,
  height: number,
  displace: number,
): THREE.PlaneGeometry => {
  const canvas = document.createElement("canvas");
  canvas.width = DEPTH_MAP;
  canvas.height = DEPTH_MAP;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Could not read still for depth");
  }
  context.drawImage(image, 0, 0, DEPTH_MAP, DEPTH_MAP);
  const pixels = context.getImageData(0, 0, DEPTH_MAP, DEPTH_MAP).data;
  const gas = new Float32Array(DEPTH_MAP * DEPTH_MAP);
  for (let i = 0; i < gas.length; i += 1) {
    const offset = i * 4;
    const r = pixels[offset] / 255;
    const g = pixels[offset + 1] / 255;
    const b = pixels[offset + 2] / 255;
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const chroma = maxc - minc;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const star = luma > 0.78 && chroma < 0.14;
    gas[i] = star ? luma * 0.04 : chroma * 0.72 + luma * 0.22;
  }
  const blurred = blurLuma(gas, DEPTH_MAP, 4);

  const geometry = new THREE.PlaneGeometry(width, height, SEGMENTS, SEGMENTS);
  const position = geometry.attributes.position;

  for (let index = 0; index < position.count; index += 1) {
    const u = clamp01(position.getX(index) / width + 0.5);
    const v = clamp01(position.getY(index) / height + 0.5);
    const px = Math.min(DEPTH_MAP - 1, Math.floor(u * (DEPTH_MAP - 1)));
    const py = Math.min(DEPTH_MAP - 1, Math.floor((1 - v) * (DEPTH_MAP - 1)));
    const sample = blurred[py * DEPTH_MAP + px];
    const depth = clamp01((sample - 0.04) / 0.55);
    position.setZ(index, depth * depth * displace);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

export const useNebulaAsset = (still: Still, depth: number): NebulaAsset | null => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [asset, setAsset] = useState<NebulaAsset | null>(null);
  const handleRef = useRef<number | null>(null);
  const displace = still.depth * depth;
  const planeWidth = PLANE_HEIGHT * (still.width / still.height);

  useEffect(() => {
    const handle = delayRender(`nebula-${still.id}`, {
      timeoutInMilliseconds: 60000,
      retries: 2,
    });
    handleRef.current = handle;
    setAsset(null);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const texture = new THREE.Texture(enhanceStill(image));
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        texture.needsUpdate = true;
        const geometry = bakeRelief(image, planeWidth, PLANE_HEIGHT, displace);
        setAsset({
          texture,
          geometry,
          planeWidth,
          planeHeight: PLANE_HEIGHT,
        });
      } catch (error) {
        cancelRender(error);
      }
    };
    image.onerror = () => {
      cancelRender(new Error(`Could not load still ${still.id}`));
    };
    image.src = still.src;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [cancelRender, delayRender, displace, planeWidth, still.id, still.src]);

  useLayoutEffect(() => {
    if (!asset || handleRef.current === null) {
      return;
    }
    const handle = handleRef.current;
    const frame = requestAnimationFrame(() => {
      continueRender(handle);
      handleRef.current = null;
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [asset, continueRender]);

  useEffect(() => {
    return () => {
      asset?.texture.dispose();
      asset?.geometry.dispose();
    };
  }, [asset]);

  return asset;
};
