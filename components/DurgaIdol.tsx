export default function DurgaIdol() {
  return (
    <svg
      viewBox="0 0 400 520"
      className="h-full w-full"
      aria-label="Maa Durga idol, stylized"
      role="img"
    >
      <defs>
        <linearGradient id="gold-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2d9a0" />
          <stop offset="100%" stopColor="#8a6a30" />
        </linearGradient>
        <radialGradient id="idol-glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="190" rx="180" ry="180" fill="url(#idol-glow)" />

      {/* chalchitra backdrop arch */}
      <path
        d="M60 260 C60 120 130 30 200 30 C270 30 340 120 340 260"
        fill="none"
        stroke="url(#gold-edge)"
        strokeWidth="2.5"
        opacity="0.55"
      />
      <path
        d="M90 260 C90 145 140 62 200 62 C260 62 310 145 310 260"
        fill="none"
        stroke="url(#gold-edge)"
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* halo rays */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (360 / 12) * i;
        return (
          <line
            key={i}
            x1="200"
            y1="150"
            x2="200"
            y2="60"
            stroke="#ffcf8f"
            strokeWidth="1.5"
            opacity="0.25"
            transform={`rotate(${angle} 200 150)`}
          />
        );
      })}

      {/* multiple arms, simplified as radiating limbs with implements */}
      <g stroke="#2e2530" strokeWidth="10" strokeLinecap="round" opacity="0.95">
        <line x1="200" y1="230" x2="110" y2="175" />
        <line x1="200" y1="235" x2="95" y2="230" />
        <line x1="200" y1="245" x2="105" y2="285" />
        <line x1="200" y1="230" x2="290" y2="175" />
        <line x1="200" y1="235" x2="305" y2="230" />
        <line x1="200" y1="245" x2="295" y2="285" />
      </g>
      {/* weapon glints at hand tips */}
      {[
        [110, 175],
        [95, 230],
        [105, 285],
        [290, 175],
        [305, 230],
        [295, 285],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#e7c777" opacity="0.85" />
      ))}

      {/* torso / drape */}
      <path
        d="M150 210 Q200 195 250 210 L268 400 Q200 430 132 400 Z"
        fill="#1c1620"
        stroke="url(#gold-edge)"
        strokeWidth="2"
      />
      <path
        d="M150 210 Q200 195 250 210"
        fill="none"
        stroke="#b23a2e"
        strokeWidth="6"
        opacity="0.7"
      />

      {/* neck + face */}
      <rect x="185" y="170" width="30" height="34" rx="8" fill="#1c1620" />
      <ellipse cx="200" cy="150" rx="42" ry="48" fill="#20191f" stroke="url(#gold-edge)" strokeWidth="1.5" />

      {/* crown */}
      <path
        d="M158 118 L160 80 L182 104 L200 66 L218 104 L240 80 L242 118 Z"
        fill="url(#gold-edge)"
      />
      <circle cx="200" cy="60" r="6" fill="#e7c777" />

      {/* eyes */}
      <path d="M178 148 Q188 142 198 148" stroke="#f3ecdf" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M202 148 Q212 142 222 148" stroke="#f3ecdf" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M196 160 L204 160 L200 168 Z" fill="#b23a2e" opacity="0.75" />

      {/* base lotus */}
      <ellipse cx="200" cy="430" rx="86" ry="16" fill="#151019" stroke="url(#gold-edge)" strokeWidth="1.5" />

      {/* lion, minimal silhouette to the left */}
      <g opacity="0.9" stroke="#4a3a42" strokeWidth="1">
        <ellipse cx="70" cy="420" rx="46" ry="24" fill="#1c1620" />
        <circle cx="34" cy="404" r="16" fill="#1c1620" />
        <path d="M20 392 Q34 372 48 392" fill="#1c1620" />
      </g>
    </svg>
  );
}
