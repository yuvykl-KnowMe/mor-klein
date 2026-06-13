// Delicate wabi-sabi line-art motifs, drawn in the brand slate.
// All decorative + aria-hidden; sized and positioned by the wrapper's className.

const SLATE = "#5B7B8A";

type MotifProps = { className?: string };

const strokeProps = {
  stroke: SLATE,
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

// Continuous-line leaf with central + side veins and a few speckles.
export function Leaf({ className = "" }: MotifProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 240"
      fill="none"
      className={`w-full ${className}`}
    >
      <g {...strokeProps}>
        <path d="M152 20C92 60 56 132 70 206" />
        <path d="M152 20C150 96 118 162 74 214" />
        <path d="M152 20C124 82 100 144 80 202" />
        <path d="M80 202c-3 12-6 22-9 34" />
        <path d="M112 92 95 118" />
        <path d="M126 100 144 122" />
        <path d="M101 126 84 150" />
        <path d="M115 134 134 154" />
      </g>
      <g fill={SLATE}>
        <circle cx="58" cy="150" r="1.5" />
        <circle cx="50" cy="166" r="1.3" />
        <circle cx="64" cy="178" r="1.2" />
        <circle cx="132" cy="96" r="1.4" />
      </g>
    </svg>
  );
}

// Thin branch with small looped bows at the tips.
export function Branch({ className = "" }: MotifProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 180"
      fill="none"
      className={`w-full ${className}`}
    >
      <g {...strokeProps}>
        <path d="M14 150C66 134 100 106 152 92" />
        <path d="M152 92 190 80" />
        <path d="M96 117C100 88 104 64 99 42" />
        <path d="M122 105C129 82 137 62 153 47" />
        <path d="M99 42c-7-4-12 2-9 8 3 5 12 2 10-5 1-1 8-6 12 1" />
        <path d="M153 47c-7-3-12 3-8 8 4 4 12 0 9-6 1-1 8-5 12 2" />
        <path d="M190 80c-6-4-12 1-8 7 3 4 11 1 8-5" />
      </g>
    </svg>
  );
}

// Flowing swirl with a small ring and a scatter of dots.
export function Swirl({ className = "" }: MotifProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 130"
      fill="none"
      className={`w-full ${className}`}
    >
      <g {...strokeProps}>
        <path d="M14 80C58 56 82 60 114 84C144 106 172 96 202 50" />
        <circle cx="66" cy="72" r="9" />
      </g>
      <g fill={SLATE}>
        <circle cx="150" cy="96" r="1.5" />
        <circle cx="162" cy="104" r="1.3" />
        <circle cx="140" cy="108" r="1.2" />
        <circle cx="176" cy="92" r="1.3" />
      </g>
    </svg>
  );
}

// Loose continuous scribble of overlapping circles.
export function Scribble({ className = "" }: MotifProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 150 130"
      fill="none"
      className={`w-full ${className}`}
    >
      <g {...strokeProps}>
        <path d="M64 30C104 22 128 56 112 88C98 116 52 114 44 84C38 60 62 44 88 54C112 62 114 92 90 102" />
      </g>
    </svg>
  );
}

// A loose speckle cluster.
export function Dots({ className = "" }: MotifProps) {
  const pts = [
    [5, 5],
    [16, 3],
    [11, 14],
    [3, 20],
    [22, 16],
    [18, 27],
    [28, 8],
    [9, 30],
    [26, 30],
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 34 36"
      fill="none"
      className={`w-full ${className}`}
    >
      <g fill={SLATE}>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" />
        ))}
      </g>
    </svg>
  );
}
