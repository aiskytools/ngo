export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const IMAGE_DATA_URL_RE = /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]{6,18}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertObjectId(id, field = "id") {
  if (typeof id !== "string" || !OBJECT_ID_RE.test(id)) {
    throw new ValidationError(`Invalid ${field}`);
  }
}

export function assertNonEmptyString(value, field, { max = 5000, min = 1 } = {}) {
  if (typeof value !== "string") throw new ValidationError(`${field} is required`);
  const trimmed = value.trim();
  if (trimmed.length < min) throw new ValidationError(`${field} is required`);
  if (trimmed.length > max) throw new ValidationError(`${field} exceeds ${max} characters`);
  return trimmed;
}

export function assertOptionalString(value, field, { max = 5000 } = {}) {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new ValidationError(`${field} exceeds ${max} characters`);
  return trimmed;
}

export function assertEmail(value, field = "email") {
  const trimmed = assertNonEmptyString(value, field, { max: 254 });
  if (!EMAIL_RE.test(trimmed)) throw new ValidationError(`Invalid ${field}`);
  return trimmed.toLowerCase();
}

export function assertPhone(value, field = "phone") {
  const trimmed = assertNonEmptyString(value, field, { max: 20 });
  if (!PHONE_RE.test(trimmed)) throw new ValidationError(`Invalid ${field}`);
  return trimmed;
}

export function assertIsoDate(value, field = "date") {
  const trimmed = assertNonEmptyString(value, field, { max: 10 });
  if (!ISO_DATE_RE.test(trimmed) || Number.isNaN(Date.parse(trimmed))) {
    throw new ValidationError(`Invalid ${field}`);
  }
  return trimmed;
}

export function assertEnum(value, field, allowed) {
  if (!allowed.includes(value)) {
    throw new ValidationError(`${field} must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

export function assertBase64Image(dataUrl, { maxBytes = 5 * 1024 * 1024 } = {}) {
  if (typeof dataUrl !== "string") throw new ValidationError("Image is required");
  const match = IMAGE_DATA_URL_RE.exec(dataUrl);
  if (!match) throw new ValidationError("Image must be PNG, JPEG, or WebP base64 data URL");
  const approxBytes = Math.floor((match[2].length * 3) / 4);
  if (approxBytes > maxBytes) {
    throw new ValidationError(`Image exceeds ${Math.floor(maxBytes / 1024 / 1024)}MB`);
  }
  return dataUrl;
}

export function assertAmount(value, field = "amount", { min = 1, max = 1_000_000 } = {}) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new ValidationError(`${field} must be a whole number`);
  }
  if (n < min) throw new ValidationError(`${field} must be at least ${min}`);
  if (n > max) throw new ValidationError(`${field} must not exceed ${max}`);
  return n;
}

export function parsePaginationParams(searchParams, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  let limit = parseInt(searchParams.get("limit") || String(defaultLimit), 10) || defaultLimit;
  limit = Math.min(Math.max(1, limit), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
}

// Wraps a route handler so ValidationError → 400, other errors → 500.
export function withValidation(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ValidationError) {
        const { NextResponse } = await import("next/server");
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }
  };
}
