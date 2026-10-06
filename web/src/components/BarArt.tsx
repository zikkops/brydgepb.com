import { useId } from "react";

// PLACEHOLDER product art: a protein bar wrapper drawn in the flavour's colour,
// used everywhere a product photo will go once real photos exist (UPGRADE.md P4.2).

export const INK = { espresso: "#392519", cream: "#F8F5F0" } as const;

type Props = {
  name: string;
  color: string;
  ink: "espresso" | "cream";
  protein?: number;
  className?: string;
};

// Zig-zag crimp along a wrapper end, like a heat-sealed flow wrap.
function crimp(x: number, dir: 1 | -1, top: number, bottom: number, teeth = 9, depth = 9) {
  const step = (bottom - top) / teeth;
  let d = "";
  for (let i = 1; i <= teeth; i++) {
    const yMid = top + step * (i - 0.5);
    const yEnd = top + step * i;
    d += ` L ${x - dir * depth} ${yMid.toFixed(1)} L ${x} ${yEnd.toFixed(1)}`;
  }
  return d;
}

const W = 420;
const H = 150;
const TOP = 12;
const BOTTOM = H - 12;
const L = 16;
const R = W - 16;

// Wrapper outline: top edge, right crimp going down, bottom edge, left crimp going up.
const leftUp = (() => {
  const teeth = 9;
  const step = (BOTTOM - TOP) / teeth;
  let d = "";
  for (let i = 1; i <= teeth; i++) {
    d += ` L ${L - 9} ${(BOTTOM - step * (i - 0.5)).toFixed(1)} L ${L} ${(BOTTOM - step * i).toFixed(1)}`;
  }
  return d;
})();
const OUTLINE = `M ${L} ${TOP} L ${R} ${TOP}${crimp(R, -1, TOP, BOTTOM)} L ${L} ${BOTTOM}${leftUp} Z`;

export function BarArt({ name, color, ink, protein = 20, className }: Props) {
  const id = useId().replace(/:/g, "");
  const inkHex = INK[ink];
  const label = ink === "cream" ? INK.cream : INK.espresso;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`Brydge ${name} protein bar`}>
      <defs>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>

      {/* soft floor shadow */}
      <ellipse cx={W / 2} cy={H - 4} rx={W * 0.42} ry="5" fill="#392519" opacity="0.14" />

      <path d={OUTLINE} fill={color} />
      <g clipPath={`url(#clip-${id})`}>
        {/* seal bands at each end */}
        <rect x={L - 10} y={TOP} width="30" height={BOTTOM - TOP} fill="#000" opacity="0.08" />
        <rect x={R - 20} y={TOP} width="30" height={BOTTOM - TOP} fill="#000" opacity="0.08" />
        {/* diagonal flavour stripe */}
        <path d={`M ${W * 0.62} ${TOP} L ${W * 0.74} ${TOP} L ${W * 0.6} ${BOTTOM} L ${W * 0.48} ${BOTTOM} Z`} fill={label} opacity="0.12" />
        <rect x="0" y="0" width={W} height={H} fill={`url(#shine-${id})`} />
      </g>

      {/* wordmark */}
      <text
        x="52"
        y="72"
        fill={inkHex}
        style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: 44, letterSpacing: "-0.02em" }}
      >
        BRYDGE
      </text>
      <text x="54" y="92" fill={inkHex} opacity="0.8" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: 9, letterSpacing: "0.32em" }}>
        BUILT FOR YOU
      </text>
      <text x="52" y="118" fill={inkHex} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: 15, letterSpacing: "0.12em" }}>
        {name.toUpperCase()}
      </text>

      {/* protein badge */}
      <g transform={`translate(${W - 86} ${H / 2})`}>
        <circle r="34" fill={inkHex} />
        <circle r="29" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="2 3" />
        <text textAnchor="middle" y="4" fill={color} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: 24 }}>
          {protein}g
        </text>
        <text textAnchor="middle" y="18" fill={color} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: 7, letterSpacing: "0.2em" }}>
          PROTEIN
        </text>
      </g>
    </svg>
  );
}
