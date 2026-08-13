// Notification hooks. Implemented by the email/automation layer; callers
// (admin actions) invoke these and must never fail if sending fails.

/** Called right after a session is marked done. Sends the payment-due email
 *  (total unpaid balance) to the patient — once wired to an email provider. */
export async function onSessionDone(_sessionId: string): Promise<void> {
  // Email layer not wired yet (no RESEND_API_KEY). Intentionally a no-op.
}
