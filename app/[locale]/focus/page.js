import AnimatedSection from "@/app/components/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BookOpen, Sprout, Stethoscope, Users, Briefcase, HandHeart, Heart } from "lucide-react";

const areaMeta = [
  { icon: BookOpen, color: "from-blue-500 to-cyan-500" },
  { icon: Sprout, color: "from-emerald-500 to-green-500" },
  { icon: Stethoscope, color: "from-rose-500 to-pink-500" },
  { icon: Users, color: "from-purple-500 to-violet-500" },
  { icon: Briefcase, color: "from-amber-500 to-orange-500" },
  { icon: HandHeart, color: "from-red-500 to-rose-500" },
];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "focus" });
  return { title: t("metaTitle") };
}

export default async function FocusPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("focus");
  const areas = t.raw("areas").map((a, i) => ({ ...a, ...areaMeta[i] }));

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">{t("heroTitle")}</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {areas.map((a, i) => (
              <AnimatedSection key={a.title} delay={i * 0.08}>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white`}>
                      <a.icon size={24} />
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900">{a.title}</h3>
                  </div>
                  <p className="text-gray-500 mb-5">{a.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {a.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {a.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">{tag}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <AnimatedSection>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gray-900 mb-4">{t("ctaTitle")}</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">{t("ctaText")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2"><Heart size={18} fill="currentColor" />{t("donateBtn")}</Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 rounded-2xl font-semibold hover:bg-emerald-50 transition-all">{t("partnerBtn")}</Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
