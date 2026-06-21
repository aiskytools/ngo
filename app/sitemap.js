import { getDb } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

// Generated at request time so blog/notice detail URLs stay current. If the DB is
// unreachable, falls back to the static routes so the sitemap never 500s.
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/focus", priority: 0.8, changeFrequency: "monthly" },
  { path: "/stories", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/notices", priority: 0.7, changeFrequency: "weekly" },
  { path: "/enquiry", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/donate", priority: 0.9, changeFrequency: "monthly" },
];

const { defaultLocale, locales } = routing;

// One sitemap entry per page, with hreflang alternates for every locale.
function entry(path, lastModified, changeFrequency, priority) {
  const languages = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;
  return {
    url: `${SITE_URL}/${defaultLocale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default async function sitemap() {
  const now = new Date();
  const entries = STATIC_ROUTES.map(r => entry(r.path, now, r.changeFrequency, r.priority));

  try {
    const db = await getDb();
    const [blogs, notices] = await Promise.all([
      db.collection("blogs").find({}, { projection: { updatedAt: 1, createdAt: 1 } }).limit(2000).toArray(),
      db.collection("notices").find({}, { projection: { updatedAt: 1, createdAt: 1 } }).limit(2000).toArray(),
    ]);
    for (const b of blogs) {
      entries.push(entry(`/blog/${b._id.toString()}`, b.updatedAt || b.createdAt || now, "monthly", 0.6));
    }
    for (const n of notices) {
      entries.push(entry(`/notices/${n._id.toString()}`, n.updatedAt || n.createdAt || now, "monthly", 0.5));
    }
  } catch (error) {
    console.error("sitemap: DB unavailable, returning static routes only:", error.message);
  }

  return entries;
}
