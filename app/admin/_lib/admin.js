// Shared client helpers for the admin portal.

// Wraps fetch with JSON handling. On 401 it invokes onAuthExpire so the portal
// can drop back to the login screen instead of failing silently mid-edit.
export async function jsonRequest(url, { method = "GET", body, onAuthExpire } = {}) {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    onAuthExpire?.();
    throw new Error("Your session has expired. Please log in again.");
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty/non-JSON body */
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function uploadImageToCloud(base64, onAuthExpire) {
  if (!base64) return { url: "", publicId: "" };
  return jsonRequest("/api/upload", { method: "POST", body: { image: base64 }, onAuthExpire });
}

// Reads a user-selected image file into a base64 data URL after validating the
// type and size client-side (the server re-validates independently).
export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okTypes.includes(file.type)) {
      reject(new Error("Please choose a PNG, JPEG, or WebP image."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image must be 5MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => resolve(ev.target.result);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
