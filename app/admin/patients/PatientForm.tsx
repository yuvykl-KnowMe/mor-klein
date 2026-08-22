import { buttonClass, DAY_NAMES, inputClass, type Patient } from "./helpers";

export default function PatientForm({
  action,
  defaults = {},
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<Patient>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm text-ink-muted">
          שם *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaults.name ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm text-ink-muted">
            טלפון
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            defaultValue={defaults.phone ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-ink-muted">
            מייל
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            defaultValue={defaults.email ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="rate" className="block text-sm text-ink-muted">
          תעריף לפגישה (₪)
        </label>
        <input
          id="rate"
          name="rate"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          defaultValue={defaults.rate ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm text-ink-muted">
          הערות כלליות
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaults.notes ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="reminders_enabled"
            defaultChecked={defaults.reminders_enabled ?? true}
          />
          תזכורות לפגישה
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="chase_enabled"
            defaultChecked={defaults.chase_enabled ?? true}
          />
          מרדף תשלום
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="zoom_enabled"
            defaultChecked={defaults.zoom_enabled ?? true}
          />
          מייל קישור זום לפני פגישה
        </label>
      </div>

      <fieldset className="rounded-xl border border-line p-4">
        <legend className="px-1 text-sm text-ink-muted">
          פגישה קבועה שבועית
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="weekly_day" className="block text-sm text-ink-muted">
              יום בשבוע
            </label>
            <select
              id="weekly_day"
              name="weekly_day"
              defaultValue={defaults.weekly_day ?? ""}
              className={inputClass}
            >
              <option value="">אין</option>
              {DAY_NAMES.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="weekly_time"
              className="block text-sm text-ink-muted"
            >
              שעה
            </label>
            <input
              id="weekly_time"
              name="weekly_time"
              type="time"
              defaultValue={defaults.weekly_time ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="weekly_active"
            defaultChecked={defaults.weekly_active ?? false}
          />
          הפגישה הקבועה פעילה
        </label>
      </fieldset>

      <button type="submit" className={buttonClass}>
        {submitLabel}
      </button>
    </form>
  );
}
