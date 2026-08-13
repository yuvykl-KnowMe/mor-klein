// Shared bits for the admin pages only.

export type Submission = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  age: string | null;
  gender: string | null;
  email: string | null;
  occupation: string | null;
  marital_status: string | null;
  hospitalization: string | null;
  medication: string | null;
  reason: string | null;
  expectations: string | null;
  status: string;
  admin_note: string | null;
};

const dateFormat = new Intl.DateTimeFormat("he-IL", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Jerusalem",
});

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

export function isHandled(status: string) {
  return status === "handled";
}

export function statusLabel(status: string) {
  return isHandled(status) ? "טופל" : "חדש";
}

export function statusBadgeClass(status: string) {
  return isHandled(status)
    ? "inline-block rounded-full border border-line bg-sand px-3 py-0.5 text-sm text-ink-muted"
    : "inline-block rounded-full bg-accent-deep px-3 py-0.5 text-sm text-on-accent";
}

/** "054-205-4105" -> "https://wa.me/972542054105" */
export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}
