// Decorative placeholder where Mor's portrait will go later.
// The wrapper's dimensions and radius are exactly where next/image drops in.
export function PortraitSlot() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto aspect-[4/5] w-56 overflow-hidden rounded-[2.5rem] border border-line bg-surface sm:mx-0 sm:w-72"
    >
      <svg
        viewBox="0 0 224 280"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Overlapping organic shapes in sage, low opacity */}
        <circle cx="60" cy="220" r="110" fill="#7C8C6E" opacity="0.16" />
        <circle cx="190" cy="70" r="90" fill="#7C8C6E" opacity="0.12" />
        <path
          d="M112 70c40 0 70 34 70 86s-30 94-70 94-70-42-70-94 30-86 70-86z"
          fill="#7C8C6E"
          opacity="0.2"
        />
        <path
          d="M112 96c-2 30-22 50-50 54 28 4 48 24 50 54 2-30 22-50 50-54-28-4-48-24-50-54z"
          fill="#5E6E50"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
