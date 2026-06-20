// Shared lookups for the Stories feature. Kept server-importable (no "use client")
// so both API validation and the public pages reference the SAME allowed values.
// The full Tailwind class strings appear here as literals so the Tailwind v4
// content scanner emits them (dynamic class names are not otherwise discoverable).

export const STORY_TAG_COLORS = {
  Education: "bg-blue-500",
  Health: "bg-rose-500",
  "Women Emp.": "bg-purple-500",
  "Rural Dev": "bg-emerald-500",
  Relief: "bg-orange-600",
};

export const STORY_THEMES = {
  teal: "from-teal-400 to-blue-500",
  orange: "from-orange-400 to-rose-500",
  purple: "from-purple-400 to-violet-500",
  cyan: "from-cyan-400 to-teal-500",
  emerald: "from-emerald-400 to-green-500",
  amber: "from-amber-400 to-orange-500",
};

export const STORY_TAGS = Object.keys(STORY_TAG_COLORS);
export const STORY_THEME_KEYS = Object.keys(STORY_THEMES);

export function tagColor(tag) {
  return STORY_TAG_COLORS[tag] || STORY_TAG_COLORS.Education;
}

export function themeGradient(theme) {
  return STORY_THEMES[theme] || STORY_THEMES.teal;
}
