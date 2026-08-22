"use client";

import { useState } from "react";
import { PAYMENT_METHODS } from "@/lib/morning";
import { buttonClass, inputClass } from "./helpers";

export type PayableSession = {
  id: string;
  date: string;
  price: number;
};

const ils = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Records a payment: pick which sessions it settles, then state the amount
 * actually received. The amount follows the ticked sessions but stays
 * editable — a receipt must show the money that changed hands, which is not
 * always the sum of the session prices.
 */
export default function PaymentForm({
  sessions,
  action,
}: {
  sessions: PayableSession[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [picked, setPicked] = useState<string[]>(sessions.map((s) => s.id));
  const [amount, setAmount] = useState(
    String(sessions.reduce((t, s) => t + s.price, 0)),
  );
  // Tracks whether the amount is still following the ticks; once Mor types
  // her own number we stop overwriting it.
  const [amountEdited, setAmountEdited] = useState(false);

  const pickedTotal =
    Math.round(
      sessions
        .filter((s) => picked.includes(s.id))
        .reduce((t, s) => t + s.price, 0) * 100,
    ) / 100;

  function toggle(sessionId: string) {
    const next = picked.includes(sessionId)
      ? picked.filter((x) => x !== sessionId)
      : [...picked, sessionId];
    setPicked(next);
    if (!amountEdited) {
      const sum =
        Math.round(
          sessions
            .filter((s) => next.includes(s.id))
            .reduce((t, s) => t + s.price, 0) * 100,
        ) / 100;
      setAmount(String(sum));
    }
  }

  const typed = Number(amount);
  const gap = Number.isFinite(typed)
    ? Math.round((typed - pickedTotal) * 100) / 100
    : 0;

  return (
    <form action={action} className="mt-4 space-y-4">
      <fieldset>
        <legend className="text-sm text-ink-muted">
          אילו פגישות התשלום סוגר?
        </legend>
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-lg border border-line">
          {sessions.map((s) => (
            <li key={s.id}>
              <label className="flex cursor-pointer items-center gap-3 p-3 text-sm hover:bg-sand">
                <input
                  type="checkbox"
                  name="session_ids"
                  value={s.id}
                  checked={picked.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                <span className="flex-1">{s.date}</span>
                <span className="text-ink-muted">{ils.format(s.price)}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-ink-muted">
          נבחרו {picked.length} פגישות · {ils.format(pickedTotal)}
        </p>
      </fieldset>

      <div>
        <label htmlFor="pay_amount" className="block text-sm text-ink-muted">
          סכום שהתקבל בפועל (₪) — זה הסכום שיופיע בקבלה
        </label>
        <input
          id="pay_amount"
          name="amount"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setAmountEdited(true);
          }}
          className={inputClass}
        />
        {gap !== 0 && Number.isFinite(typed) ? (
          <p className="mt-1 text-sm text-ink-muted">
            {gap > 0
              ? `${ils.format(gap)} מעבר לסכום הפגישות שנבחרו.`
              : `${ils.format(-gap)} פחות מסכום הפגישות שנבחרו — הן יסומנו כשולמו במלואן.`}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="pay_method" className="block text-sm text-ink-muted">
          אמצעי תשלום
        </label>
        <select
          id="pay_method"
          name="payment_method"
          defaultValue="bit"
          className={inputClass}
        >
          {Object.entries(PAYMENT_METHODS).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="confirm" required />
        אני מאשרת הפקת קבלה אמיתית על {ils.format(Number(amount) || 0)}
      </label>

      <button
        type="submit"
        className={buttonClass}
        disabled={picked.length === 0}
      >
        סימון שולם והפקת קבלה
      </button>
    </form>
  );
}
