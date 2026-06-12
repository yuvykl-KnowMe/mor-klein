"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

// Fades + rises its children in once when they enter the viewport.
// All motion is gated in globals.css behind prefers-reduced-motion:
// reduced-motion users get the children visible and static.
export function Reveal({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal data-visible={visible || undefined} {...props}>
      {children}
    </div>
  );
}
