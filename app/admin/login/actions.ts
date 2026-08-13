"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, safeEqual, sessionToken } from "@/lib/adminSession";

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  // Trimmed on both sides: an invisible trailing space (easy to paste into
  // Vercel or type on a phone) must not lock Mor out.
  const password = String(formData.get("password") ?? "").trim();
  const expected = process.env.ADMIN_PASSWORD?.trim();

  // Password managers autofill the email as the username — accept both.
  const validUser = username === "mor" || username === "mor@mor-klein.co.il";
  if (!expected || !validUser || !safeEqual(password, expected)) {
    redirect("/admin/login?error=1");
  }

  (await cookies()).set(SESSION_COOKIE, sessionToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // stay signed in for ~6 months
  });
  redirect("/admin");
}
