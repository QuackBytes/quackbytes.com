"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  if (persist) localStorage.setItem("quackbytes-theme", theme);
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followSystem = (event: MediaQueryListEvent) => {
    if (localStorage.getItem("quackbytes-theme")) return;
    applyTheme(event.matches ? "dark" : "light", false);
    callback();
  };
  window.addEventListener("quackbytes:theme", callback);
  media.addEventListener("change", followSystem);
  return () => {
    window.removeEventListener("quackbytes:theme", callback);
    media.removeEventListener("change", followSystem);
  };
}

export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");

  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    window.dispatchEvent(new Event("quackbytes:theme"));
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
    >
      <span aria-hidden="true">☀️</span>
      <span aria-hidden="true">🌙</span>
    </button>
  );
}