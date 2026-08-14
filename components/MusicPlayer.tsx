"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PUJO_PLAYLIST, PLAYLIST_URL } from "@/lib/pujoPlaylist";
import { useYouTubePlayer } from "@/lib/useYouTubePlayer";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface MusicPlayerProps {
  soundOn?: boolean;
  onToggleSound?: (on: boolean) => void;
}

export default function MusicPlayer({ soundOn, onToggleSound }: MusicPlayerProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    containerRef,
    ready,
    isPlaying,
    currentTime,
    duration,
    currentIndex,
    currentTrack,
    hasMultipleTracks,
    toggle,
    goNext,
    goPrev,
    goToIndex,
    seekToFraction,
    play,
    pause,
  } = useYouTubePlayer(PUJO_PLAYLIST);

  // Synchronize playing state with global soundOn prop
  useEffect(() => {
    if (soundOn === undefined) return;
    if (soundOn) {
      if (ready && !isPlaying) {
        play();
      }
    } else {
      if (isPlaying) {
        pause();
      }
    }
  }, [soundOn, ready, isPlaying, play, pause]);

  const progress = duration > 0 ? currentTime / duration : 0;

  const filteredPlaylist = PUJO_PLAYLIST.map((track, originalIndex) => ({
    ...track,
    originalIndex,
  })).filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-4 z-40 flex flex-col items-center px-4 sm:bottom-6 select-none">
      {/* Real YouTube playback engine */}
      <div ref={containerRef} className="absolute h-px w-px overflow-hidden opacity-0" />

      {/* Expandable 56-Track Playlist Drawer */}
      {showPlaylist && (
        <div className="drift-in mb-3 flex max-h-[380px] w-full max-w-[460px] flex-col rounded-2xl border border-[#c9a35e]/30 bg-[#0c0a10]/95 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#c9a35e]/20">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff9548] animate-pulse" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3ecdf]">
                Pujo Playlist ({PUJO_PLAYLIST.length} Songs)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPlaylist(false)}
              className="text-xs text-[#cbb9a8]/70 hover:text-[#f3ecdf]"
            >
              ✕ Close
            </button>
          </div>

          {/* Search Filter input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search 56 songs or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#c9a35e]/20 bg-[#17121f] px-3 py-1.5 text-xs text-[#f3ecdf] placeholder-[#cbb9a8]/40 outline-none focus:border-[#c9a35e]/60"
            />
          </div>

          {/* Scrollable Song List */}
          <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {filteredPlaylist.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#cbb9a8]/50">
                No songs match your search
              </p>
            ) : (
              filteredPlaylist.map((item) => {
                const isSelected = item.originalIndex === currentIndex;
                return (
                  <button
                    key={item.originalIndex}
                    type="button"
                    onClick={() => {
                      goToIndex(item.originalIndex, true);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "border border-[#c9a35e]/40 bg-[#c9a35e]/20 text-[#f3ecdf]"
                        : "hover:bg-[#f3ecdf]/5 text-[#cbb9a8]/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="w-5 text-right font-mono text-[0.65rem] opacity-60">
                        {item.originalIndex + 1}.
                      </span>
                      <div className="min-w-0">
                        <p className={`truncate font-medium ${isSelected ? "text-[#ffd788]" : "text-[#f3ecdf]"}`}>
                          {item.title}
                        </p>
                        <p className="truncate text-[0.65rem] opacity-70">
                          {item.artist}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="shrink-0 text-[0.65rem] uppercase tracking-wider text-[#ff9548]">
                        {isPlaying ? "▶ Playing" : "Paused"}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main Music Player Control Bar */}
      <div className="drift-in flex w-full max-w-[460px] items-center gap-3 rounded-2xl border border-[#c9a35e]/30 bg-[#0c0a10]/90 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {currentTrack && (
          <div className="relative shrink-0">
            <Image
              src={`https://img.youtube.com/vi/${currentTrack.videoId}/hqdefault.jpg`}
              alt=""
              width={52}
              height={52}
              className="h-13 w-13 rounded-lg object-cover border border-[#c9a35e]/20"
              aria-hidden
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-[#ff9548] animate-[bounce_0.6s_infinite_100ms] h-full" />
                  <span className="w-1 bg-[#ffcf73] animate-[bounce_0.6s_infinite_300ms] h-2/3" />
                  <span className="w-1 bg-[#ff9548] animate-[bounce_0.6s_infinite_200ms] h-5/6" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[0.82rem] font-semibold text-[#f3ecdf]">
              {currentTrack?.title ?? "—"}
            </p>
            <span className="shrink-0 font-mono text-[0.62rem] text-[#c9a35e]/80">
              {currentIndex + 1} / {PUJO_PLAYLIST.length}
            </span>
          </div>

          <p className="truncate text-[0.68rem] text-[#cbb9a8]/70">
            {currentTrack?.artist ?? ""}
          </p>

          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") seekToFraction(Math.max(0, progress - 0.05));
              if (e.key === "ArrowRight") seekToFraction(Math.min(1, progress + 0.05));
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seekToFraction((e.clientX - rect.left) / rect.width);
            }}
            className="mt-1.5 flex h-3 cursor-pointer items-center"
          >
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#f3ecdf]/15">
              <div
                className="h-full rounded-full bg-[#c9a35e] transition-[width] duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-0.5 flex justify-between text-[0.6rem] tabular-nums text-[#cbb9a8]/50">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Action Buttons */}
        <div className="flex shrink-0 items-center gap-1">
          {hasMultipleTracks && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous track"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#cbb9a8] transition-colors hover:bg-[#c9a35e]/10 hover:text-[#f3ecdf]"
            >
              ◀
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onToggleSound) {
                onToggleSound(!isPlaying);
              } else {
                toggle();
              }
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a35e]/60 bg-[#c9a35e]/10 text-[#f3ecdf] transition-all hover:bg-[#c9a35e]/20 hover:scale-105"
          >
            {isPlaying ? "❙❙" : "▶"}
          </button>

          {hasMultipleTracks && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next track"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#cbb9a8] transition-colors hover:bg-[#c9a35e]/10 hover:text-[#f3ecdf]"
            >
              ▶
            </button>
          )}

          {/* Playlist Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPlaylist((v) => !v)}
            title="Open 56 Songs Playlist"
            className={`ml-1 flex h-8 items-center gap-1 rounded-lg border px-2 text-[0.62rem] uppercase tracking-wider transition-colors ${
              showPlaylist
                ? "border-[#c9a35e] bg-[#c9a35e]/30 text-[#f3ecdf]"
                : "border-[#c9a35e]/30 bg-[#17121f] text-[#cbb9a8] hover:border-[#c9a35e]/60 hover:text-[#f3ecdf]"
            }`}
          >
            <span>☰</span>
            <span className="hidden sm:inline">Songs</span>
          </button>
        </div>
      </div>
    </div>
  );
}

