// Shared status vocabularies for inbound records (contacts, donations).
// Centralized so API routes and the admin UI validate against the same lists.

export const CONTACT_STATUSES = ["new", "read", "responded", "archived"];

// Online donations move pending -> paid/failed via the Razorpay verify flow.
// "refunded" and "manual" support admin bookkeeping and offline/bank entries.
export const DONATION_STATUSES = ["pending", "paid", "failed", "refunded", "manual"];

export const DONATION_FUNDS = [
  "General Fund",
  "Education & Scholarships",
  "Health Camps",
  "Women Empowerment",
  "Rural Development",
];
