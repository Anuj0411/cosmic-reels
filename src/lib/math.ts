export const VOID = "#050816";
export const STAR = "#e8eef8";
export const DUST = "#8ea0c8";
export const FIRE = "#ffb36a";
export const CORE = "#fff4d6";

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
