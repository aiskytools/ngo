// Server-side HTML sanitizer for rich-text (Tiptap) content. ALL editor HTML is
// passed through this before being stored, so the public site only ever renders
// HTML from a strict allowlist — the primary defense against stored XSS.
import sanitizeHtmlLib from "sanitize-html";

const OPTIONS = {
  allowedTags: [
    "p", "br", "hr", "blockquote", "pre", "code", "span", "div",
    "strong", "b", "em", "i", "u", "s", "mark", "sub", "sup",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "a", "img",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col", "figure", "figcaption",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
    div: ["data-youtube-video"],
    td: ["colspan", "rowspan", "colwidth"],
    th: ["colspan", "rowspan", "colwidth"],
    col: ["span"],
    code: ["class"],
    pre: ["class"],
    span: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"], iframe: ["https"] },
  // YouTube embeds only — any other iframe src is dropped.
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"],
  allowIframeRelativeUrls: false,
  // Force safe link attributes regardless of what the editor produced.
  transformTags: {
    a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer nofollow", target: "_blank" }, true),
  },
  disallowedTagsMode: "discard",
};

export function sanitizeRichHtml(html) {
  if (typeof html !== "string" || html.trim() === "") return "";
  return sanitizeHtmlLib(html, OPTIONS);
}

// Plain-text excerpt for cards, meta descriptions, and search.
export function htmlToExcerpt(html, maxLen = 180) {
  if (typeof html !== "string") return "";
  const text = sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

// True when the value contains markup (used to decide HTML vs plain rendering).
export function looksLikeHtml(value) {
  return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
}
