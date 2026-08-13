"use client";

import { useState } from "react";

// Small client bits for /admin/week: the new-session form (price follows the
// selected patient's rate) and a copy button for the calendar-feed URL.

const inputClass = "mt-1 w-full rounded-lg border border-line bg-surface p-3";
const buttonClass =
  "rounded-lg bg-accent-deep px-4 py-2 text-on-accent hover:bg-accent-deeper";

export type PatientOption = { id: string; name: string; rate: number };

export function NewSessionForm({
  patients,
  action,
}: {
  patients: PatientOption[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [price, setPrice] = useState(String(patients[0]?.rate ?? ""));

  if (patients.length === 0) {
    return (
      <p className="mt-3 text-sm text-ink-muted">
        אין עדיין מטופלים — קודם מוסיפים מטופל/ת במסך המטופלים.
      </p>
    );
  }

  return (
    <form action={action} className="mt-3 space-y-3">
      <div>
        <label htmlFor="ns-patient" className="block text-sm text-ink-muted">
          מטופל/ת
        </label>
        <select
          id="ns-patient"
          name="patient_id"
          className={inputClass}
          onChange={(e) => {
            const p = patients.find((x) => x.id === e.target.value);
            setPrice(String(p?.rate ?? ""));
          }}
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ns-when" className="block text-sm text-ink-muted">
          תאריך ושעה
        </label>
        <input
          id="ns-when"
          name="scheduled_at"
          type="datetime-local"
          required
          className={inputClass}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="ns-duration" className="block text-sm text-ink-muted">
            משך (דקות)
          </label>
          <input
            id="ns-duration"
            name="duration_min"
            type="number"
            min={5}
            step={5}
            defaultValue={50}
            required
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="ns-price" className="block text-sm text-ink-muted">
            מחיר (₪)
          </label>
          <input
            id="ns-price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>
      <button type="submit" className={buttonClass}>
        הוספת פגישה
      </button>
    </form>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm hover:bg-sand"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard unavailable (non-secure context) — user can copy manually.
        }
      }}
    >
      {copied ? "הועתק ✓" : "העתקה"}
    </button>
  );
}
