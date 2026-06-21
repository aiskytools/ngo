// Responsive, email-client-safe templates (table layout + inline styles) with
// professional NGO branding. Each builder returns { subject, html, text }.
// All user-supplied values are HTML-escaped before interpolation.

const BRAND = "#059669";
const DARK = "#0f172a";
const ORG_NAME = "Aadhar Manuskicha";
const ORG_FOOTER = "Sant Gadgebaba Sevabhavi Sanstha · Ambajogai, Beed, Maharashtra · +91 9422242106 · santgadgebabango1@gmail.com";

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function layout({ heading, bodyHtml, accent = BRAND }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:${accent};padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold;">
          ${ORG_NAME} &middot; आधार माणुसकीचा
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 18px;font-size:20px;line-height:1.3;color:#111827;">${heading}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:18px 28px;background:${DARK};color:#9ca3af;font-size:12px;line-height:1.6;">
          ${ORG_FOOTER}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function detailRows(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 8px;">
    ${rows.map(([k, v]) => `<tr>
      <td style="padding:8px 12px 8px 0;color:#6b7280;font-size:13px;width:150px;vertical-align:top;">${esc(k)}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;vertical-align:top;">${esc(v)}</td>
    </tr>`).join("")}
  </table>`;
}

function messageBlock(label, message) {
  return `<div style="margin-top:16px;">
    <div style="color:#6b7280;font-size:13px;margin-bottom:6px;">${esc(label)}</div>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(message)}</div>
  </div>`;
}

function rowsText(rows) {
  return rows.map(([k, v]) => `${k}: ${String(v ?? "")}`).join("\n");
}

// ── Admin: new contact message ──────────────────────────────
export function contactNotification(d) {
  const rows = [["Name", d.name], ["Email", d.email], ["Phone", d.phone || "—"], ["Subject", d.subject], ["IP", d.ip || "—"]];
  return {
    subject: `New contact message: ${d.subject || "General Query"}`,
    html: layout({ heading: "New contact message", bodyHtml: detailRows(rows) + messageBlock("Message", d.message) }),
    text: `New contact message\n\n${rowsText(rows)}\n\nMessage:\n${d.message || ""}`,
  };
}

// ── Admin: new enquiry ──────────────────────────────────────
export function enquiryNotification(d) {
  const rows = [["Name", d.name], ["Email", d.email], ["Phone", d.phone], ["Category", d.category], ["Subject", d.subject], ["IP", d.ip || "—"]];
  return {
    subject: `New enquiry (${d.category || "General"}): ${d.subject || ""}`,
    html: layout({ heading: "New enquiry received", bodyHtml: detailRows(rows) + messageBlock("Message", d.message) }),
    text: `New enquiry received\n\n${rowsText(rows)}\n\nMessage:\n${d.message || ""}`,
  };
}

// ── Admin: successful login alert ───────────────────────────
export function loginNotification(d) {
  const rows = [["Time", d.time], ["IP address", d.ip || "—"], ["Device", d.userAgent || "—"]];
  return {
    subject: "Admin sign-in to Aadhar Manuskicha",
    html: layout({
      heading: "Admin panel sign-in",
      bodyHtml: `<p style="margin:0 0 14px;color:#374151;font-size:14px;">A successful sign-in to the admin dashboard was recorded. If this wasn't you, change the admin password immediately.</p>${detailRows(rows)}`,
      accent: "#d97706",
    }),
    text: `Admin panel sign-in\n\nIf this wasn't you, change the admin password immediately.\n\n${rowsText(rows)}`,
  };
}

// ── Admin: new donation ─────────────────────────────────────
export function donationAdminNotification(d) {
  const amount = `₹${Number(d.amountInr || 0).toLocaleString("en-IN")}`;
  const rows = [["Donor", d.name], ["Amount", amount], ["Fund", d.fund || "General Fund"], ["Email", d.email || "—"], ["Phone", d.phone || "—"], ["Payment ID", d.paymentId || "—"]];
  return {
    subject: `New donation received: ${amount}`,
    html: layout({ heading: "New donation received 🎉", bodyHtml: detailRows(rows) }),
    text: `New donation received\n\n${rowsText(rows)}`,
  };
}

// ── Donor: thank-you / receipt ──────────────────────────────
export function donorReceipt(d) {
  const amount = `₹${Number(d.amountInr || 0).toLocaleString("en-IN")}`;
  const rows = [["Amount", amount], ["Towards", d.fund || "General Fund"], ["Payment ID", d.paymentId || "—"]];
  const body = `<p style="margin:0 0 14px;color:#374151;font-size:15px;line-height:1.6;">Dear ${esc(d.name || "Friend")},</p>
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Thank you for your generous donation to ${ORG_NAME}. Your support directly funds education, healthcare, and livelihoods for families in Marathwada.</p>
    ${detailRows(rows)}
    <p style="margin:16px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">This donation is eligible for 80G tax exemption. An official 80G receipt will follow from our team.</p>`;
  return {
    subject: `Thank you for your donation — ${ORG_NAME}`,
    html: layout({ heading: "Thank you for your generosity 🙏", bodyHtml: body }),
    text: `Dear ${d.name || "Friend"},\n\nThank you for your generous donation to ${ORG_NAME}.\n\n${rowsText(rows)}\n\nThis donation is eligible for 80G tax exemption; an official receipt will follow.`,
  };
}
