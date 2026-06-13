"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { ctaBase, ctaVariants } from "@/components/ui/CtaLink";
import { BOOKING_URL } from "@/lib/site";

// Derive the Cal.com link path ("mor-klein/intro") and a namespace from the
// single-source BOOKING_URL, so the link lives in exactly one place.
const CAL_LINK = BOOKING_URL.replace(/^https?:\/\/cal\.com\//, "");
const CAL_NAMESPACE = CAL_LINK.split("/").pop() ?? "intro";

type BookingButtonProps = {
  children: React.ReactNode;
  className?: string;
};

// Opens the booking flow as an in-site popup (modal), never a redirect away.
export function BookingButton({ children, className }: BookingButtonProps) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
      className={`${ctaBase} ${ctaVariants.primary}${className ? ` ${className}` : ""}`}
    >
      {children}
    </button>
  );
}
