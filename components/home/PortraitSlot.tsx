import Image from "next/image";
import portrait from "@/public/mor-portrait.png";

// Mor's portrait as the focal point, set inside the brand art:
// gold organic blobs and a slate continuous-line accent frame the photo.
export function PortraitSlot() {
  return (
    <div className="relative mx-auto w-64 sm:mx-0 sm:w-72 lg:w-80">
      {/* Brand art bleeding around the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-7 -z-10"
      >
        <svg
          viewBox="0 0 360 440"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="86" cy="360" r="120" fill="#C4A97D" opacity="0.3" />
          <circle cx="300" cy="96" r="92" fill="#C4A97D" opacity="0.22" />
          <ellipse cx="250" cy="350" rx="110" ry="86" fill="#C4A97D" opacity="0.16" />
          {/* slate continuous line hugging the frame */}
          <path
            d="M40 120c-18 70-14 150 16 220"
            stroke="#5B7B8A"
            strokeWidth="2.25"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M324 130c16 64 12 138-14 204"
            stroke="#5B7B8A"
            strokeWidth="2.25"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* The photo, focal point */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.75rem] border border-line bg-surface">
        <Image
          src={portrait}
          alt="מור קליין"
          priority
          sizes="(max-width: 640px) 16rem, (max-width: 1024px) 18rem, 20rem"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Small slate line flourish at the lower corner */}
      <svg
        aria-hidden="true"
        viewBox="0 0 80 40"
        fill="none"
        className="pointer-events-none absolute -bottom-5 start-6 w-20 opacity-50"
      >
        <path
          d="M4 28c18-12 40-14 72-6"
          stroke="#5B7B8A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
