// Injects Cloudinary delivery transformations into a stored secure_url so images
// are served as auto-format (WebP/AVIF), auto-quality, and optionally width-capped.
// No-ops for non-Cloudinary URLs and is a pure string function (safe on client).

export function cloudinaryUrl(url, { width } = {}) {
  if (typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (url.includes("/upload/f_auto")) return url; // already optimized

  const parts = ["f_auto", "q_auto"];
  if (width) {
    parts.push(`w_${width}`, "c_limit", "dpr_auto");
  }
  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}
