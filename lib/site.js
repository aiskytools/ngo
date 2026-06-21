// Central site identity + integration config. Only public-safe values belong here
// (this module is imported by client components). Server-only secrets stay elsewhere.

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const SITE_URL = rawUrl.replace(/\/+$/, "");

export const SITE_NAME = "Aadhar Manuskicha";
export const SITE_LEGAL_NAME = "Sant Gadgebaba Sevabhavi Sanstha";
export const SITE_TAGLINE = "आधार माणुसकीचा";
export const SITE_DESCRIPTION =
  "Inspired by Sant Gadgebaba, we transform rural lives through education, healthcare, women empowerment, and sustainable community development in Marathwada, Maharashtra.";

// Google Analytics 4 — inert until NEXT_PUBLIC_GA_ID is set.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// WhatsApp floating button — digits only, defaults to the org's published number.
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919422242106").replace(/[^\d]/g, "");

// Structured-data / contact details for the organization.
export const ORG = {
  name: SITE_NAME,
  legalName: SITE_LEGAL_NAME,
  email: "santgadgebabango1@gmail.com",
  phone: "+919422242106",
  foundingDate: "2001-07-18",
  address: {
    streetAddress: "Shivajinagar, Bank Colony, Jogaiwadi",
    addressLocality: "Ambajogai",
    addressRegion: "Maharashtra",
    postalCode: "431517",
    addressCountry: "IN",
  },
};
