import type { FC } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { z } from "zod";
import { Meteors } from "../cosmos/Meteors";
import { NebulaRelief } from "../cosmos/NebulaRelief";
import { TravelStars } from "../cosmos/TravelStars";
import { useNebulaAsset } from "../cosmos/useNebulaAsset";
import { flights } from "../lib/flights";
import { VOID } from "../lib/math";
import { stillDistance, stillIds, stills } from "../lib/stills";
import { Caption } from "./Caption";

export const nebulaSchema = z.object({
  stillId: z.enum(stillIds),
  flight: z.enum(flights),
  title: z.string(),
  showCredit: z.boolean(),
  depth: z.number().min(0).max(2),
  zoom: z.number().min(1.2).max(3.2),
  focusX: z.number().min(-1).max(1),
  focusY: z.number().min(-1).max(1),
  meteors: z.boolean(),
  travelStars: z.boolean(),
  bank: z.number().min(-0.5).max(0.5),
});

export type NebulaFlyProps = z.infer<typeof nebulaSchema>;

const prepareGl = ({ gl }: { gl: THREE.WebGLRenderer }) => {
  gl.toneMapping = THREE.NoToneMapping;
  gl.outputColorSpace = THREE.SRGBColorSpace;
};

export const NebulaFly: FC<NebulaFlyProps> = ({
  stillId,
  flight,
  title,
  showCredit,
  depth,
  zoom,
  focusX,
  focusY,
  meteors,
  travelStars,
  bank,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const still = stills[stillId];
  const asset = useNebulaAsset(still, depth);
  const pixelScale = width / 1080;

  return (
    <AbsoluteFill style={{ backgroundColor: VOID }}>
      {asset ? (
        <ThreeCanvas
          width={width}
          height={height}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 9.1], fov: 38, near: 0.08, far: 40 }}
          onCreated={prepareGl}
        >
          <color attach="background" args={[VOID]} />
          <NebulaRelief
            asset={asset}
            t={t}
            zoom={zoom}
            flight={flight}
            focusX={focusX}
            focusY={focusY}
            bank={bank}
          />
          {travelStars ? (
            <TravelStars seed={stillId} t={t} pixelScale={pixelScale} />
          ) : null}
          {meteors ? (
            <Meteors
              seed={`${stillId}-meteors`}
              frame={frame}
              fps={fps}
              count={32}
              volume="nebula"
              pixelScale={pixelScale}
            />
          ) : null}
        </ThreeCanvas>
      ) : null}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(5, 8, 22, 0) 46%, rgba(5, 8, 22, 0.42) 100%)",
        }}
      />
      <Caption
        title={title || still.title}
        credit={showCredit ? still.credit : undefined}
        distance={stillDistance[stillId]}
      />
    </AbsoluteFill>
  );
};
