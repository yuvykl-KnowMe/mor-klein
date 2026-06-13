import type { ReactNode } from "react";
import { Parallax } from "@/components/decor/Parallax";
import { Reveal } from "@/components/decor/Reveal";

// Absolutely-positioned decorative item. The Parallax wrapper carries the
// scroll drift; the optional Reveal carries the fade-in. Rotation/mirroring
// lives on the inner SVG, so the three transforms never collide.
export function Float({
  className = "",
  speed = 0,
  reveal = true,
  children,
}: {
  className?: string;
  speed?: number;
  reveal?: boolean;
  children: ReactNode;
}) {
  return (
    <Parallax
      aria-hidden="true"
      speed={speed}
      className={`pointer-events-none absolute ${className}`}
    >
      {reveal ? <Reveal aria-hidden>{children}</Reveal> : children}
    </Parallax>
  );
}

// Soft warm-gold blob that fills its (parallax) wrapper.
export function Blob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-full w-full rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(196,169,125,0.32), rgba(196,169,125,0) 70%)",
      }}
    />
  );
}

// Thin slate line arc. Sized/positioned by the wrapper's className.
export function LineArc({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 120"
      fill="none"
      className={`w-full ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M6 110C44 28 156 28 194 110"
        stroke="#5B7B8A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

// Hand-drawn slate separator placed between sections; fades in on scroll.
export function Divider() {
  return (
    <Reveal aria-hidden className="mx-auto flex max-w-5xl justify-center px-6">
      <svg
        viewBox="0 0 220 16"
        fill="none"
        className="w-40 opacity-50"
        preserveAspectRatio="none"
      >
        <path
          d="M4 9c40-7 84 5 124 1 28-3 56-6 88 2"
          stroke="#5B7B8A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Reveal>
  );
}
