import type { FC } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const HANDLE = "follow antrix_00";

export const Signature: FC<{ opacity: number; scale: number }> = ({
  opacity,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shimmer = ((frame / fps) * 28) % 100;
  const scan = interpolate(frame % Math.round(fps * 3.2), [0, 18, 36], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fontSize = 20 * scale;
  const padX = 14 * scale;
  const padY = 8 * scale;

  return (
    <div
      style={{
        opacity,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: `${padY}px ${padX}px`,
          border: `${1.2 * scale}px solid rgba(186, 236, 255, ${0.38 + scan * 0.22})`,
          borderRadius: 3 * scale,
          background:
            "linear-gradient(135deg, rgba(80, 210, 255, 0.12), rgba(255, 90, 200, 0.08) 48%, rgba(255, 214, 110, 0.1))",
          boxShadow: `0 0 ${18 * scale}px rgba(120, 210, 255, 0.22), inset 0 0 ${10 * scale}px rgba(255, 255, 255, 0.08)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shimmer - 12}%, rgba(255,255,255,0.28) ${shimmer}%, transparent ${shimmer + 12}%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1.4 * scale,
            top: `${8 + scan * 72}%`,
            background: "linear-gradient(90deg, transparent, rgba(190, 250, 255, 0.85), transparent)",
            opacity: 0.55 + scan * 0.35,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: "rgba(70, 230, 255, 0.55)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize,
            fontWeight: 600,
            letterSpacing: "0.16em",
            lineHeight: 1,
            transform: `translate(${-1.1 * scale}px, 0)`,
            mixBlendMode: "screen",
            padding: `${padY}px ${padX}px`,
          }}
        >
          {HANDLE}
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: "rgba(255, 80, 190, 0.45)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize,
            fontWeight: 600,
            letterSpacing: "0.16em",
            lineHeight: 1,
            transform: `translate(${1.1 * scale}px, ${0.6 * scale}px)`,
            mixBlendMode: "screen",
            padding: `${padY}px ${padX}px`,
          }}
        >
          {HANDLE}
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize,
            fontWeight: 600,
            letterSpacing: "0.16em",
            lineHeight: 1,
            backgroundImage:
              "linear-gradient(90deg, #9ef6ff, #d4b7ff, #ffd48a, #9ef6ff)",
            backgroundSize: "220% 100%",
            backgroundPosition: `${shimmer}% 50%`,
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 ${8 * scale}px rgba(160, 230, 255, 0.55))`,
          }}
        >
          {HANDLE}
        </div>
      </div>
    </div>
  );
};
