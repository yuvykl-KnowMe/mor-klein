// Intentional decorative composition standing in for Mor's portrait:
// a continuous-line figure in slate over warm-gold organic blobs.
// The wrapper's dimensions and radius are exactly where next/image drops in later.
export function PortraitSlot() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[4/5] w-64 overflow-hidden rounded-[2.75rem] border border-line bg-surface sm:mx-0 sm:w-80 lg:w-[22rem]"
    >
      <svg
        viewBox="0 0 320 400"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="portrait-glow" cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#C4A97D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C4A97D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Warm gold glow + grounding blobs */}
        <rect width="320" height="400" fill="url(#portrait-glow)" />
        <circle cx="70" cy="328" r="128" fill="#C4A97D" opacity="0.32" />
        <circle cx="268" cy="120" r="96" fill="#C4A97D" opacity="0.22" />
        <ellipse cx="190" cy="300" rx="120" ry="96" fill="#C4A97D" opacity="0.18" />

        {/* Continuous-line figure, single slate stroke */}
        <g
          stroke="#5B7B8A"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        >
          {/* head + neck + shoulders in one flowing contour */}
          <path d="M133 196c-16-10-25-29-25-52 0-31 23-54 52-54s52 23 52 54c0 23-9 42-25 52 26 7 47 24 58 50 9 20 13 44 13 70H62c0-26 4-50 13-70 11-26 32-43 58-50z" />
          {/* brow + nose, a quiet inner line */}
          <path d="M138 96c8-7 18-10 22-10s14 3 22 10" />
          <path d="M160 104v26c0 6-4 10-9 12" />
          {/* calm mouth */}
          <path d="M150 150c6 4 14 4 20 0" />
        </g>

        {/* Matted inner frame */}
        <rect
          x="14"
          y="14"
          width="292"
          height="372"
          rx="36"
          stroke="#5B7B8A"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
