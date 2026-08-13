// Server-only client for the Morning (Green Invoice) API.
// Schema verified against the official OpenAPI spec served at
// https://developers.morning.co (docs/openapi.bundled.json, v2.0.0).

const BASE_URL = "https://api.greeninvoice.co.il/api/v1";

const RECEIPT_TYPE = 400; // קבלה
const DOC_VAT_EXEMPT = 1; // document vatType: exempt (osek patur, no VAT)
const ITEM_VAT_EXEMPT = 2; // income row vatType: exempt

// PaymentGroup codes per the spec:
// 1 = cash, 4 = bank transfer, 10 = payment app (appType: 1=Bit, 3=PayBox), 11 = other.
export const PAYMENT_METHODS = {
  bit: { label: "ביט", type: 10, appType: 1 },
  paybox: { label: "פייבוקס", type: 10, appType: 3 },
  cash: { label: "מזומן", type: 1 },
  bank_transfer: { label: "העברה בנקאית", type: 4 },
  other: { label: "אחר", type: 11 },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedToken.expires - 60) return cachedToken.token;
  const res = await fetch(`${BASE_URL}/account/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: process.env.GREENINVOICE_API_KEY,
      secret: process.env.GREENINVOICE_API_SECRET,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Morning auth failed (HTTP ${res.status})`);
  cachedToken = (await res.json()) as { token: string; expires: number };
  return cachedToken.token;
}

export type ReceiptInput = {
  name: string;
  /** When provided, Morning emails the receipt to this address (client.emails). */
  email?: string;
  phone?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  remarks?: string;
};

export type Receipt = { id: string; number: number; url: string };

/** Creates a real receipt (type 400) in Mor's Morning bookkeeping. */
export async function createReceipt(input: ReceiptInput): Promise<Receipt> {
  const method = PAYMENT_METHODS[input.paymentMethod];
  // Today in Asia/Jerusalem, formatted YYYY-MM-DD (en-CA gives ISO order).
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
  }).format(new Date());

  const body = {
    type: RECEIPT_TYPE,
    date,
    lang: "he",
    currency: "ILS",
    vatType: DOC_VAT_EXEMPT,
    description: input.description,
    ...(input.remarks ? { remarks: input.remarks } : {}),
    attachment: true, // attach the PDF when Morning emails the receipt
    client: {
      name: input.name,
      ...(input.email ? { emails: [input.email] } : {}),
      ...(input.phone ? { phone: input.phone } : {}),
      add: false, // one-off client details; keep Morning's client list clean
    },
    income: [
      {
        description: input.description,
        quantity: 1,
        price: input.amount,
        currency: "ILS",
        vatType: ITEM_VAT_EXEMPT,
      },
    ],
    payment: [
      {
        date,
        type: method.type,
        ...("appType" in method ? { appType: method.appType } : {}),
        price: input.amount,
        currency: "ILS",
      },
    ],
  };

  const res = await fetch(`${BASE_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data as { errorMessage?: string } | null)?.errorMessage ??
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  const doc = data as {
    id: string;
    number: number;
    url?: { origin?: string; he?: string };
  };
  return { id: doc.id, number: doc.number, url: doc.url?.origin ?? doc.url?.he ?? "" };
}
