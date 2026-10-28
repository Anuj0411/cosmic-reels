import type { FC } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { z } from "zod";
import { BlackHole } from "../cosmos/BlackHole";
import { CameraFlight } from "../cosmos/CameraFlight";
import { DustLane } from "../cosmos/DustLane";
import { Meteors } from "../cosmos/Meteors";
import { StarField } from "../cosmos/StarField";
import { SupernovaBurst } from "../cosmos/SupernovaBurst";
import { VOID } from "../lib/math";
import { Caption } from "./Caption";

export const cosmicEvents = [
  "flight",
  "meteors",
  "supernova",
  "blackhole",
] as const;

export const cosmicSchema = z.object({
  event: z.enum(cosmicEvents),
  title: z.string(),
  seed: z.string(),
});

export type CosmicProps = z.infer<typeof cosmicSchema>;

export const CosmicVideo: FC<CosmicProps> = ({ event, title, seed }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);

  const supernovaPulse = interpolate(frame, [42, 62, 110], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = event === "supernova" ? supernovaPulse : Math.sin(frame * 0.035) * 0.08 + 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: VOID }}>
      <ThreeCanvas
        width={width}
        height={height}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.2, 11], fov: 55, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <color attach="background" args={[VOID]} />
        <CameraFlight t={t} />
        <StarField seed={seed} count={4200} t={t} pulse={pulse} />
        <DustLane seed={seed} count={980} t={t} pulse={pulse} />
        {event === "meteors" ? (
          <Meteors seed={seed} frame={frame} fps={fps} />
        ) : null}
        {event === "supernova" ? (
          <SupernovaBurst frame={frame} fps={fps} />
        ) : null}
        {event === "blackhole" ? (
          <BlackHole seed={seed} frame={frame} fps={fps} />
        ) : null}
      </ThreeCanvas>
      <Caption title={title} />
    </AbsoluteFill>
  );
};
