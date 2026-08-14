"use client";

type SoundControllerProps = {
  soundOn: boolean;
  onToggle: () => void;
  className?: string;
};

export default function SoundController({
  soundOn,
  onToggle,
  className = "",
}: SoundControllerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
      className={`pointer-events-auto flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-[#cbb9a8]/70 transition-colors hover:text-[#f3ecdf] ${className}`}
    >
      <span
        className="inline-block h-[6px] w-[6px] rounded-full"
        style={{
          background: soundOn ? "#c9a35e" : "transparent",
          border: "1px solid #cbb9a8",
        }}
        aria-hidden
      />
      {soundOn ? "Sound On" : "Sound Off"}
    </button>
  );
}
