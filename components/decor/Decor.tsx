import { Reveal } from "@/components/decor/Reveal";

// Soft warm-gold blob. `variant` controls the gentle scroll parallax
// direction (drift-* classes are gated on prefers-reduced-motion in globals.css).
export function Blob({
  className = "",
  variant = "up",
}: {
  className?: string;
  variant?: "up" | "down";
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full drift-${variant} ${className}`}
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
