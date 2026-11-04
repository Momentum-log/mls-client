"use client";

import React, { FC, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Rings from "@/components/site/rings";
import type { SiteCopy } from "@/components/site/copy";

/** Frame padding and outer radius; the video's radius is derived from both. */
const FRAME_PADDING = 16;
const FRAME_RADIUS = 32;

const formatTime = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const controlClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow";

/**
 * The portrait (9:16) company film with Momentum's own controls: play/pause,
 * a seek bar, time, mute and full screen. The 6.4 MB file loads only on play.
 */
const CompanyFilm: FC<{ copy: SiteCopy["about"] }> = ({ copy }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const video = (): HTMLVideoElement | null => videoRef.current;

  const togglePlay = (): void => {
    const el = video();
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const toggleMute = (): void => {
    const el = video();
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const el = video();
    if (!el) return;
    el.currentTime = Number(event.target.value);
    setTime(el.currentTime);
  };

  const fullScreen = (): void => {
    void video()?.requestFullscreen?.();
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      className="pattern-dots-light relative isolate inline-flex max-w-full overflow-hidden bg-brand-navy"
      style={{ padding: FRAME_PADDING, borderRadius: FRAME_RADIUS }}
    >
      <Rings />
      <div
        className="group relative aspect-[9/16] w-[300px] max-w-full overflow-hidden bg-black shadow-2xl sm:w-[320px]"
        // Nested radius rule: inner radius = outer radius - padding.
        style={{ borderRadius: FRAME_RADIUS - FRAME_PADDING }}
      >
        <video
          ref={videoRef}
          src="/videos/momentum-company.mp4"
          poster="/videos/momentum-company-poster.jpg"
          preload="none"
          playsInline
          aria-label={copy.filmLabel}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          className="block h-full w-full cursor-pointer object-cover"
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={copy.filmPlay}
            className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow text-foreground shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
          </button>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-black/55 p-3 transition-opacity duration-200 ${
            isPlaying ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-100"
          }`}
        >
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={seek}
            disabled={!duration}
            aria-label={copy.filmSeek}
            aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-brand-yellow disabled:cursor-default"
            style={{
              background: `linear-gradient(to right, #fcb417 ${progress}%, rgb(255 255 255 / 0.3) ${progress}%)`,
            }}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? copy.filmPause : copy.filmPlay}
              className={controlClass}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" aria-hidden="true" />
              ) : (
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              )}
            </button>
            <span className="font-mono text-xs text-white tabular-nums">
              {formatTime(time)} / {formatTime(duration)}
            </span>
            <span className="flex-1" />
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? copy.filmUnmute : copy.filmMute}
              className={controlClass}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Volume2 className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button type="button" onClick={fullScreen} aria-label={copy.filmFullscreen} className={controlClass}>
              <Maximize className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyFilm;
