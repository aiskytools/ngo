import AnimatedSection from "@/app/components/AnimatedSection";
import SectionHeading from "@/app/components/SectionHeading";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Eye, Target, Search, Recycle } from "lucide-react";

const valueIcons = [Eye, Target, Search, Recycle];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle") };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = t.raw("values");
  const details = [
    { label: t("regNameLabel"), value: t("regNameValue") },
    { label: t("popularNameLabel"), value: t("popularNameValue") },
    { label: t("establishedLabel"), value: t("establishedValue") },
    { label: t("orgTypeLabel"), value: t("orgTypeValue") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">{t("heroTitle")}</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="w-full aspect-[4/5] rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                  <span className="text-8xl">🌱</span>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-2xl border-4 border-amber-400">
                  <span className="font-[family-name:var(--font-heading)] text-3xl font-bold text-emerald-800">2001</span>
                  <span className="text-xs text-gray-500 font-medium">{t("founded")}</span>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700">{t("journeyLabel")}</span>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-gray-900 mb-6">{t("journeyTitle")}</h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>{t("story1")}</p>
                <p>{t("story2")}</p>
                <p>{t("story3")}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading label={t("valuesLabel")} title={t("valuesTitle")} />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <AnimatedSection key={v.title} delay={i * 0.1}>
                  <div className="bg-white rounded-3xl p-7 text-center h-full border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 text-amber-600">
                      <Icon size={28} />
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sant Gadgebaba */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="text-6xl mb-6">🙏</div>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white mb-6">{t("gadgebabaTitle")}</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              {t("gadgebabaText")}
            </p>
            <p className="font-[family-name:var(--font-heading)] text-3xl text-amber-400 italic mb-4">
              &quot;माणुसकी हीच खरी श्रीमंती&quot;
            </p>
            <p className="text-gray-400 text-sm">{t("gadgebabaQuoteSub")}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Founder + Legal */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 border-t-4 border-t-emerald-600 shadow-sm h-full">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-3xl">⚖️</div>
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900">{t("founderName")}</h3>
                    <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider">{t("founderRole")}</p>
                  </div>
                </div>
                <div className="text-gray-500 leading-relaxed space-y-3 text-sm">
                  <p>{t("founderP1")}</p>
                  <p>{t("founderP2")}</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700">{t("officialLabel")}</span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-6">{t("officialTitle")}</h3>
                <div className="grid grid-cols-2 gap-6">
                  {details.map((item) => (
                    <div key={item.label}>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-gray-900 font-semibold text-sm">{item.value}</div>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t("registeredOfficeLabel")}</div>
                    <div className="text-gray-900 font-semibold text-sm">{t("registeredOfficeValue")}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
