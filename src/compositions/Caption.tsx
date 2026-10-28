import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Signature } from "./Signature";

export const Caption: FC<{ title: string; credit?: string; distance?: string }> = ({
  title,
  credit,
  distance,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const scale = width / 1080;
  const opacity = interpolate(
    frame,
    [10, 28, durationInFrames - 28, durationInFrames - 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const type = {
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', Helvetica, sans-serif",
    textShadow: "0 2px 18px rgba(5, 8, 22, 0.85)",
  } as const;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {title || credit ? (
        <AbsoluteFill
          style={{
            paddingTop: height * 0.16,
            paddingLeft: 52 * scale,
            paddingRight: 72 * scale,
            justifyContent: "flex-start",
          }}
        >
          <div style={{ opacity }}>
            {title ? (
              <div
                style={{
                  ...type,
                  fontSize: 36 * scale,
                  fontWeight: 500,
                  lineHeight: 1.15,
                  letterSpacing: "0.01em",
                }}
              >
                {title}
              </div>
            ) : null}
            {credit ? (
              <div
                style={{
                  marginTop: 10,
                  color: "rgba(255, 255, 255, 0.55)",
                  fontFamily: type.fontFamily,
                  fontSize: 16 * scale,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textShadow: "0 2px 12px rgba(5, 8, 22, 0.85)",
                }}
              >
                {credit}
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: height * 0.155,
          width: "max-content",
          transform: "translateX(-50%)",
        }}
      >
        <Signature opacity={opacity} scale={scale} />
      </div>
      {distance ? (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingBottom: height * 0.24,
            paddingLeft: 52 * scale,
            paddingRight: 112 * scale,
          }}
        >
          <div
            style={{
              opacity,
              color: "rgba(255, 255, 255, 0.62)",
              fontFamily: type.fontFamily,
              fontSize: 22 * scale,
              fontWeight: 400,
              letterSpacing: "0.03em",
              lineHeight: 1.3,
              textAlign: "right",
              textShadow: "0 2px 16px rgba(5, 8, 22, 0.9)",
            }}
          >
            {distance} from Earth
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
