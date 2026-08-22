// Shared bits for the patients admin pages only.

export type Patient = {
  id: string;
  created_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  rate: number;
  notes: string | null;
  reminders_enabled: boolean;
  chase_enabled: boolean;
  zoom_enabled: boolean;
  weekly_day: number | null;
  weekly_time: string | null;
  weekly_active: boolean;
};

export type SessionRow = {
  id: string;
  patient_id: string;
  scheduled_at: string;
  duration_min: number;
  status: string; // planned | done | canceled
  price: number;
  note: string | null;
  done_at: string | null;
  paid_at: string | null;
  receipt_id: string | null;
  receipt_url: string | null;
};

export const DAY_NAMES = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
];

export const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-surface p-3";
export const buttonClass =
  "rounded-lg bg-accent-deep px-4 py-2 text-on-accent hover:bg-accent-deeper";
export const owedBadgeClass =
  "inline-block rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-sm font-semibold text-red-700";

const ilsFormat = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatILS(amount: number) {
  return ilsFormat.format(amount);
}

const dayFormat = new Intl.DateTimeFormat("he-IL", {
  dateStyle: "short",
  timeZone: "Asia/Jerusalem",
});

export function formatDateOnly(iso: string) {
  return dayFormat.format(new Date(iso));
}

export function sessionStatusLabel(status: string) {
  if (status === "done") return "בוצעה";
  if (status === "canceled") return "בוטלה";
  return "מתוכננת";
}

export function sessionStatusBadge(status: string) {
  const base = "inline-block rounded-full px-3 py-0.5 text-sm ";
  if (status === "done") return base + "bg-accent-deep text-on-accent";
  if (status === "canceled")
    return base + "border border-line bg-sand text-ink-muted line-through";
  return base + "border border-accent-deep text-accent-deep";
}

export type PatientInput = {
  name: string;
  phone: string | null;
  email: string | null;
  rate: number;
  notes: string | null;
  reminders_enabled: boolean;
  chase_enabled: boolean;
  zoom_enabled: boolean;
  weekly_day: number | null;
  weekly_time: string | null;
  weekly_active: boolean;
};

/** Parses + validates the patient create/edit form. */
export function patientFromForm(
  formData: FormData,
): { ok: true; data: PatientInput } | { ok: false; error: string } {
  const str = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value || null;
  };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "יש להזין שם." };

  const rateNum = Math.round(Number(formData.get("rate") || 0) * 100) / 100;

  const weeklyDayRaw = String(formData.get("weekly_day") ?? "");
  const weekly_day = /^[0-6]$/.test(weeklyDayRaw) ? Number(weeklyDayRaw) : null;
  const weeklyTimeRaw = String(formData.get("weekly_time") ?? "");
  const weekly_time = /^\d{2}:\d{2}$/.test(weeklyTimeRaw) ? weeklyTimeRaw : null;

  return {
    ok: true,
    data: {
      name,
      phone: str("phone"),
      email: str("email"),
      rate: Number.isFinite(rateNum) && rateNum >= 0 ? rateNum : 0,
      notes: str("notes"),
      reminders_enabled: formData.get("reminders_enabled") === "on",
      chase_enabled: formData.get("chase_enabled") === "on",
      zoom_enabled: formData.get("zoom_enabled") === "on",
      weekly_day,
      weekly_time,
      // Active only makes sense with a complete slot.
      weekly_active:
        formData.get("weekly_active") === "on" &&
        weekly_day !== null &&
        weekly_time !== null,
    },
  };
}
