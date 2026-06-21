// Thin, reusable GA4 wrapper. Every call is a no-op unless NEXT_PUBLIC_GA_ID is set
// and the gtag script has loaded, so it is safe to call from anywhere.
import { GA_ID } from "@/lib/site";

function ready() {
  return typeof window !== "undefined" && !!GA_ID && typeof window.gtag === "function";
}

export function trackEvent(name, params = {}) {
  if (!ready()) return;
  window.gtag("event", name, params);
}

export function trackPageview(path) {
  if (!ready()) return;
  window.gtag("event", "page_view", { page_path: path });
}

// Named helpers for the events the spec calls out.
export const analytics = {
  contactSubmit: () => trackEvent("contact_submit"),
  enquirySubmit: (category) => trackEvent("enquiry_submit", { category }),
  donationInitiated: (amount, fund) => trackEvent("donation_initiated", { value: amount, currency: "INR", fund }),
  donationSuccess: (amount, fund) => trackEvent("donation_success", { value: amount, currency: "INR", fund }),
  blogView: (id, title) => trackEvent("blog_view", { item_id: id, item_name: title }),
  languageSelect: (lang) => trackEvent("language_select", { language: lang }),
};
