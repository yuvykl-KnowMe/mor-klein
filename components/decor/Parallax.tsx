"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

// Lightweight parallax: one shared passive scroll listener, rAF-throttled,
// applies translate3d based on each element's cached document offset vs. the
// viewport centre (no per-frame layout reads, no transform feedback loop).
// Reduced-motion users never register, so the page stays static for them.

type Item = { el: HTMLElement; speed: number; base: number; h: number };

let items: Item[] = [];
let frame = 0;
let listening = false;

function measure(it: Item) {
  const prev = it.el.style.transform;
  it.el.style.transform = "";
  const rect = it.el.getBoundingClientRect();
  it.base = rect.top + window.scrollY;
  it.h = rect.height;
  it.el.style.transform = prev;
}

function tick() {
  frame = 0;
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  for (const it of items) {
    const elementCenter = it.base + it.h / 2;
    const y = (viewportCenter - elementCenter) * it.speed;
    it.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  }
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function onResize() {
  for (const it of items) measure(it);
  onScroll();
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
}

function register(el: HTMLElement, speed: number) {
  const it: Item = { el, speed, base: 0, h: 0 };
  measure(it);
  items.push(it);
  startListening();
  onScroll();
  return () => {
    items = items.filter((i) => i !== it);
    el.style.transform = "";
  };
}

type ParallaxProps = HTMLAttributes<HTMLDivElement> & { speed?: number };

export function Parallax({ speed = 0.08, children, ...props }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return register(el, speed);
  }, [speed]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
