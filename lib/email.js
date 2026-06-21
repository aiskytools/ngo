// Centralized email service (Resend). Everything here is a safe no-op until both
// RESEND_API_KEY and ADMIN_EMAIL are configured, and send failures are swallowed
// so a transactional email can never break the request that triggered it.
import { Resend } from "resend";
import {
  contactNotification,
  enquiryNotification,
  loginNotification,
  donationAdminNotification,
  donorReceipt,
} from "@/lib/emailTemplates";

const FROM = process.env.EMAIL_FROM || "Aadhar Manuskicha <onboarding@resend.dev>";

let client;
function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);
}

function adminEmail() {
  return process.env.ADMIN_EMAIL || null;
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const resend = getClient();
  if (!resend || !to) return { skipped: true };
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html, text, replyTo });
    if (error) {
      console.error("Email send error:", error);
      return { error };
    }
    return { id: data?.id };
  } catch (err) {
    console.error("Email send threw:", err?.message || err);
    return { error: err?.message || String(err) };
  }
}

// ── Event helpers (all no-op when email isn't configured) ────

export async function notifyContact(d) {
  if (!isEmailConfigured()) return;
  const t = contactNotification(d);
  await sendEmail({ to: adminEmail(), subject: t.subject, html: t.html, text: t.text, replyTo: d.email });
}

export async function notifyEnquiry(d) {
  if (!isEmailConfigured()) return;
  const t = enquiryNotification(d);
  await sendEmail({ to: adminEmail(), subject: t.subject, html: t.html, text: t.text, replyTo: d.email });
}

export async function notifyAdminLogin(d) {
  if (!isEmailConfigured()) return;
  const t = loginNotification(d);
  await sendEmail({ to: adminEmail(), subject: t.subject, html: t.html, text: t.text });
}

export async function notifyDonation(d) {
  if (!isEmailConfigured()) return;
  // Admin notification + donor receipt (donor email is optional).
  const admin = donationAdminNotification(d);
  const tasks = [sendEmail({ to: adminEmail(), subject: admin.subject, html: admin.html, text: admin.text })];
  if (d.email) {
    const receipt = donorReceipt(d);
    tasks.push(sendEmail({ to: d.email, subject: receipt.subject, html: receipt.html, text: receipt.text }));
  }
  await Promise.allSettled(tasks);
}
