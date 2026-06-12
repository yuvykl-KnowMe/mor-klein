// Intentional decorative composition standing in for Mor's portrait.
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
          <radialGradient id="portrait-glow" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#7C8C6E" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7C8C6E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft sage glow behind the figure */}
        <rect width="320" height="400" fill="url(#portrait-glow)" />

        {/* Grounding organic shapes */}
        <circle cx="64" cy="340" r="120" fill="#7C8C6E" opacity="0.12" />
        <circle cx="270" cy="120" r="92" fill="#7C8C6E" opacity="0.1" />

        {/* Abstract serene figure: a quiet portrait suggestion */}
        <circle cx="160" cy="158" r="52" fill="#5E6E50" opacity="0.18" />
        <path
          d="M70 400c0-58 40-104 90-104s90 46 90 104z"
          fill="#5E6E50"
          opacity="0.18"
        />

        {/* Delicate leaf sprig */}
        <path
          d="M232 250c-2 26-18 44-42 49 24 4 40 22 42 48 2-26 18-44 42-48-24-5-40-23-42-49z"
          fill="#7C8C6E"
          opacity="0.3"
        />

        {/* Matted inner frame */}
        <rect
          x="14"
          y="14"
          width="292"
          height="372"
          rx="36"
          stroke="#5E6E50"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
