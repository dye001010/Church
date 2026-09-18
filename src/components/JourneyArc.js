import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from "react-native-svg";

const STARS = [
  { x: 55, y: 70 },
  { x: 90, y: 110 },
  { x: 40, y: 130 },
  { x: 120, y: 55 },
];

export default function JourneyArc({ progress }) {
  const cx = 200;
  const cy = 190;
  const r = 158;
  const angle = Math.PI * (1 - progress);
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  return (
    <Svg viewBox="0 0 400 200" style={{ width: "100%", height: 160 }}>
      <Defs>
        <LinearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#1C2541" />
          <Stop offset="55%" stopColor="#4A3F63" />
          <Stop offset="100%" stopColor="#E8B589" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#skyGrad)" />
      {STARS.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={1.6} fill="#F5EFE3" opacity={0.5} />
      ))}
      <Path d="M0,190 Q80,150 160,185 T400,190 L400,200 L0,200 Z" fill="#14192E" opacity={0.85} />
      <Circle cx={sunX} cy={sunY} r={10} fill="#F2C078" stroke="#FBF7EF" strokeWidth={2} />
    </Svg>
  );
}
