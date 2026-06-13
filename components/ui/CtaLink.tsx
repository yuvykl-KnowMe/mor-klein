import type { AnchorHTMLAttributes } from "react";

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "ghost";
};

// Shared so non-anchor CTAs (e.g. the Cal.com popup button) match exactly.
export const ctaBase =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2 font-medium transition-colors duration-300 ease-out";

export const ctaVariants = {
  primary: "bg-accent-deep text-on-accent hover:bg-accent-deeper",
  ghost: "border border-line text-accent-deep hover:bg-surface",
};

export function CtaLink({
  variant = "primary",
  className,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <a
      className={`${ctaBase} ${ctaVariants[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </a>
  );
}
