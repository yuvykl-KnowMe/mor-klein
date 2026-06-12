import type { AnchorHTMLAttributes } from "react";

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "ghost";
};

const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2 font-medium transition-colors";

const variants = {
  primary: "bg-sage-deep text-on-accent hover:bg-sage-deeper",
  ghost: "border border-line text-sage-deep hover:bg-surface",
};

export function CtaLink({
  variant = "primary",
  className,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <a
      className={`${base} ${variants[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </a>
  );
}
