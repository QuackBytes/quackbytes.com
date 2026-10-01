"use client";

import { useEffect, useRef } from "react";
import { Duck, PixelWater } from "./brand";

export function Pond({
  pond,
}: {
  pond: { noteTop: string; duckLabel: string };
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pulseFrame = useRef(0);
  const pulseRate = useRef(1);

  useEffect(() => {
    return () => {
      clearTimeout(pulseTimer.current);
      cancelAnimationFrame(pulseFrame.current);
    };
  }, []);

  function ripple() {
    const scene = sceneRef.current;
    if (!scene || scene.hasAttribute("data-intro-flying")) return;

    const animations = Array.from(
      scene.querySelectorAll<SVGGElement>(".water-band"),
    ).flatMap((band) => band.getAnimations());
    if (!animations.length) return;

    cancelAnimationFrame(pulseFrame.current);
    clearTimeout(pulseTimer.current);
    pulseRate.current = 5;
    animations.forEach((animation) =>
      animation.updatePlaybackRate(pulseRate.current),
    );

    pulseTimer.current = setTimeout(() => {
      const start = performance.now();
      const startRate = pulseRate.current;
      const settle = (now: number) => {
        const progress = Math.min((now - start) / 1100, 1);
        const eased = progress * progress * (3 - 2 * progress);
        pulseRate.current = 1 + (startRate - 1) * (1 - eased);
        animations.forEach((animation) =>
          animation.updatePlaybackRate(pulseRate.current),
        );
        if (progress < 1) pulseFrame.current = requestAnimationFrame(settle);
      };
      pulseFrame.current = requestAnimationFrame(settle);
    }, 380);
  }
  return (
    <div className="pond-composition">
      <span className="pond-note note-top">
        {pond.noteTop.split("\n").map((line, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </span>
      <svg
        className="note-arrow"
        viewBox="0 0 100 110"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 7c40 5 57 40 48 77m-12-15 11 20 17-15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="pond-scene" data-pond-scene ref={sceneRef}>
        <PixelWater />
        <button
          type="button"
          className="pond-duck"
          onClick={ripple}
          aria-label={pond.duckLabel}
        >
          <Duck size={162} />
        </button>
      </div>
    </div>
  );
}
