"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const HOLD = 1200;
const FLIGHT = 1800;
const DURATION = HOLD + FLIGHT;

const isHome = (path: string) => /^\/(tr|en)\/?$/.test(path);

// Sample a continuous curve once; the browser composites the flight without JS per frame.
function flightKeyframes(dx: number, dy: number, scale: number): Keyframe[] {
  const transform = (x: number, y: number, size: number) =>
    `translate3d(${x}px, ${y}px, 0) scale(${size})`;
  const frames: Keyframe[] = [
    { transform: transform(dx, dy, scale), offset: 0 },
    { transform: transform(dx, dy, scale), offset: HOLD / DURATION },
  ];
  for (let step = 1; step <= 60; step++) {
    const time = step / 60;
    const t = time * time * (3 - 2 * time);
    const u = 1 - t;
    const x = u * u * u * dx + 3 * u * u * t * dx * 0.92;
    const y = u * u * u * dy + 3 * u * u * t * (dy - 78) + 3 * u * t * t * -64;
    frames.push({
      transform: transform(x, y, scale + (1 - scale) * t),
      offset: (HOLD + time * FLIGHT) / DURATION,
    });
  }
  return frames;
}

/** The overlay stays mounted: hide it before cancelling its animations to prevent a flash. */
export function Intro({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingReplay = useRef(false);
  const stopRef = useRef<() => void>(() => {});
  const beginRef = useRef<(manual: boolean) => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let generation = 0;
    let frame = 0;
    let finishTimer: ReturnType<typeof setTimeout>;
    let scene: HTMLElement | null = null;
    let active = false;
    let flightScrollY = 0;
    const overlay = overlayRef.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const root = document.documentElement;

    const finish = (landed = false) => {
      generation++;
      cancelAnimationFrame(frame);
      clearTimeout(finishTimer);
      // This must precede cancel(): cancelling a faded veil restores its opaque base style.
      overlay.hidden = true;
      root.removeAttribute("data-intro-pending");
      root.removeAttribute("data-intro-active");
      animations.splice(0).forEach((animation) => {
        animation.onfinish = null;
        animation.cancel();
      });
      if (scene && active) {
        scene.removeAttribute("data-intro-flying");
        if (landed) scene.setAttribute("data-intro-stage", "landed");
        else scene.removeAttribute("data-intro-stage");
      }
      active = false;
    };
    const stop = () => finish();
    const scrollChanged = () => {
      if (
        active &&
        root.hasAttribute("data-intro-active") &&
        Math.abs(window.scrollY - flightScrollY) > 1
      )
        stop();
    };
    const visibilityChanged = () => {
      if (document.hidden) stop();
    };

    const begin = async (manual: boolean) => {
      // Repeated replay input must not restart an in-flight sequence.
      if (active) return;
      const run = ++generation;
      if (
        !isHome(pathname) ||
        (!manual && (motion.matches || window.scrollY > 80))
      ) {
        root.removeAttribute("data-intro-pending");
        return;
      }
      scene = document.querySelector<HTMLElement>("[data-pond-scene]");
      if (!scene) {
        stop();
        return;
      }
      active = true;
      // Cover the page before a footer replay scrolls, so the scroll cannot flash onscreen.
      overlay.hidden = false;
      finishTimer = setTimeout(stop, 5000);
      if (manual) window.scrollTo({ top: 0, behavior: "instant" });
      const duck = scene.querySelector<HTMLImageElement>("img");
      await Promise.all([document.fonts.ready, duck?.decode().catch(() => {})]);
      if (disposed || run !== generation) return;

      frame = requestAnimationFrame(() => {
        if (!scene || disposed || run !== generation) return;
        const composition = scene.closest<HTMLElement>(".pond-composition");
        if (!composition) {
          stop();
          return;
        }
        const compositionRect = composition.getBoundingClientRect();
        const pondTop = Number.parseFloat(
          getComputedStyle(scene).getPropertyValue("--pond-top"),
        );
        const targetWidth = compositionRect.width * 0.94;
        if (!targetWidth || !Number.isFinite(pondTop)) {
          stop();
          return;
        }
        const target = {
          left: compositionRect.left + compositionRect.width * 0.03,
          top: compositionRect.top + pondTop,
          width: targetWidth,
          height: (targetWidth * 264) / 504,
        };
        const startWidth = Math.min(320, window.innerWidth - 64);
        const scale = startWidth / target.width;
        const startX = (root.clientWidth - startWidth) / 2;
        const startY = (window.innerHeight - target.height * scale) / 2 - 34;
        if (manual) scene.setAttribute("data-motion-preview", "true");
        scene.setAttribute("data-intro-flying", "true");
        scene.setAttribute("data-intro-stage", "loading");
        flightScrollY = window.scrollY;
        root.setAttribute("data-intro-active", "true");

        const flight = scene.animate(
          flightKeyframes(startX - target.left, startY - target.top, scale),
          { duration: DURATION, fill: "both", easing: "linear" },
        );
        const veil = overlay.querySelector(".intro-veil")!;
        const caption = overlay.querySelector(".intro-caption")!;
        animations.push(
          flight,
          veil.animate(
            [
              { opacity: 1, offset: 0 },
              { opacity: 1, offset: 0.32, easing: "ease-in-out" },
              { opacity: 0, offset: 0.62 },
              { opacity: 0, offset: 1 },
            ],
            { duration: DURATION, fill: "both" },
          ),
          caption.animate(
            [
              { opacity: 1, offset: 0 },
              { opacity: 1, offset: 0.34, easing: "ease-out" },
              { opacity: 0, offset: 0.52 },
              { opacity: 0, offset: 1 },
            ],
            { duration: DURATION, fill: "both" },
          ),
        );
        const start = document.timeline.currentTime;
        if (typeof start === "number")
          animations.forEach((animation) => {
            animation.startTime = start;
          });
        // Release the first-paint placement only after the flight owns the transform.
        root.removeAttribute("data-intro-pending");
        flight.onfinish = () => finish(true);
        clearTimeout(finishTimer);
        finishTimer = setTimeout(() => finish(true), DURATION + 500);
      });
    };

    beginRef.current = begin;
    stopRef.current = stop;
    frame = requestAnimationFrame(() => {
      if (!isHome(pathname)) return;
      if (pendingReplay.current) {
        pendingReplay.current = false;
        void begin(true);
        return;
      }
      try {
        if (sessionStorage.getItem("quackbytes-intro")) {
          return;
        }
        sessionStorage.setItem("quackbytes-intro", "seen");
      } catch {
        /* A storage restriction must not block the page. */
      }
      void begin(false);
    });
    window.addEventListener("resize", stop, { passive: true });
    // Ignore redundant restoration events, but end safely if the page really moves.
    window.addEventListener("scroll", scrollChanged, { passive: true });
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    document.addEventListener("visibilitychange", visibilityChanged);
    motion.addEventListener("change", stop);
    return () => {
      disposed = true;
      if (active || !isHome(window.location.pathname)) stop();
      else {
        cancelAnimationFrame(frame);
        clearTimeout(finishTimer);
      }
      window.removeEventListener("resize", stop);
      window.removeEventListener("scroll", scrollChanged);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      document.removeEventListener("visibilitychange", visibilityChanged);
      motion.removeEventListener("change", stop);
    };
  }, [pathname]);

  useEffect(() => {
    const replay = () => {
      if (!isHome(pathname)) {
        pendingReplay.current = true;
        router.push(`/${lang}`);
      } else void beginRef.current(true);
    };
    const escape = (event: KeyboardEvent) => {
      if (
        [
          "Escape",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          "ArrowDown",
          "ArrowUp",
          "Tab",
        ].includes(event.key)
      )
        stopRef.current();
    };
    window.addEventListener("quackbytes:replay", replay);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("quackbytes:replay", replay);
      window.removeEventListener("keydown", escape);
    };
  }, [pathname, router, lang]);

  return (
    <div ref={overlayRef} className="intro" aria-hidden="true" hidden>
      <div className="intro-veil" />
      <div className="intro-caption">
        <span className="intro-wordmark">quackbytes.</span>
      </div>
    </div>
  );
}
