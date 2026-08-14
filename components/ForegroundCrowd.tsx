/**
 * Occlusion silhouettes for the near-camera "shoulders" of the people
 * you're sitting behind — the thing that actually sells first-person POV.
 * Cropped by the viewport edge, oversized relative to the rest of the
 * crowd, soft-focused, and static but for a slow shared breathing sway.
 */
export default function ForegroundCrowd() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] overflow-hidden"
      aria-hidden
    >
      <style>{`
        @keyframes shoulder-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }
      `}</style>

      {/* left shoulder/head, closest to camera */}
      <svg
        viewBox="0 0 300 220"
        className="absolute -bottom-6 -left-10 h-[78%] w-[46%] max-w-[320px]"
        style={{
          animation: "shoulder-breathe 6.5s ease-in-out infinite",
          filter: "blur(1.5px)",
        }}
      >
        <defs>
          <linearGradient id="fg-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1420" />
            <stop offset="100%" stopColor="#050408" />
          </linearGradient>
        </defs>
        <ellipse cx="150" cy="230" rx="170" ry="120" fill="url(#fg-l)" />
        <circle cx="205" cy="70" r="46" fill="url(#fg-l)" />
        <path
          d="M170 60 Q205 20 240 60"
          fill="none"
          stroke="#ff9548"
          strokeOpacity="0.15"
          strokeWidth="3"
        />
      </svg>

      {/* right shoulder, slightly further back */}
      <svg
        viewBox="0 0 300 220"
        className="absolute -bottom-8 -right-6 h-[64%] w-[38%] max-w-[280px]"
        style={{
          animation: "shoulder-breathe 7.8s ease-in-out infinite",
          animationDelay: "1.2s",
          filter: "blur(1.5px)",
        }}
      >
        <ellipse cx="150" cy="230" rx="160" ry="110" fill="#0d0a12" />
        <circle cx="95" cy="75" r="40" fill="#0d0a12" />
        <path
          d="M62 68 Q95 32 128 68"
          fill="none"
          stroke="#ff9548"
          strokeOpacity="0.12"
          strokeWidth="3"
        />
      </svg>

      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
        }}
      />
    </div>
  );
}
