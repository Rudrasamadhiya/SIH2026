import { useCallback } from "react";

/**
 * Spawns a short-lived ripple element at the pointer/touch position inside
 * whatever element the returned handler is attached to. Pairs with the
 * `.touch-ripple` / `.touch-ripple__wave` classes in index.css. Designed
 * for kiosk/tablet use where hover states don't exist but touch feedback
 * still needs to feel immediate and tactile.
 */
export default function useRipple() {
  return useCallback((event) => {
    const el = event.currentTarget;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const point = "touches" in event && event.touches?.length ? event.touches[0] : event;
    const x = (point.clientX ?? rect.width / 2) - rect.left;
    const y = (point.clientY ?? rect.height / 2) - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.2;

    const wave = document.createElement("span");
    wave.className = "touch-ripple__wave";
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${x - size / 2}px`;
    wave.style.top = `${y - size / 2}px`;

    el.appendChild(wave);
    window.setTimeout(() => wave.remove(), 650);
  }, []);
}