"use client";
import { Link } from "@/i18n/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import AnimatedSection from "@/app/components/AnimatedSection";
import SectionHeading from "@/app/components/SectionHeading";
import { motion, animate, useInView } from "framer-motion";
import { BookOpen, Sprout, Stethoscope, Users, ArrowRight, Heart, GraduationCap, Briefcase, Landmark, MapPin, Sparkles } from "lucide-react";
import { storySeeds } from "@/lib/storySeeds";
import { tagColor, themeGradient } from "@/lib/storyMeta";

const stats = [
  { num: 23, labelKey: "statYears", icon: Landmark, color: "from-amber-500 to-orange-500" },
  { num: 1200, labelKey: "statStudents", icon: GraduationCap, color: "from-blue-500 to-indigo-500" },
  { num: 25, labelKey: "statVillages", icon: MapPin, color: "from-emerald-500 to-teal-500" },
  { num: 3000, labelKey: "statLives", icon: Sparkles, color: "from-rose-500 to-pink-500" },
];

function Counter({ from = 0, to }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => setCount(Math.floor(v))
      });
      return () => controls.stop();
    }
  }, [from, to, inView]);

  return <span ref={ref}>{count}+</span>;
}

// Visual metadata for the mission cards; text comes from the `home.missions`
// translations and is zipped in by index inside the component.
const missionMeta = [
  { icon: BookOpen, color: "from-blue-500 to-cyan-500" },
  { icon: Sprout, color: "from-emerald-500 to-green-500" },
  { icon: Stethoscope, color: "from-rose-500 to-pink-500" },
  { icon: Users, color: "from-purple-500 to-violet-500" },
];

const pillars = [
  { icon: BookOpen, labelKey: "pillarEducation", color: "from-blue-500 to-cyan-500" },
  { icon: Sprout, labelKey: "pillarRural", color: "from-emerald-500 to-green-500" },
  { icon: Stethoscope, labelKey: "pillarHealth", color: "from-rose-500 to-pink-500" },
  { icon: Users, labelKey: "pillarWomen", color: "from-purple-500 to-violet-500" },
];

// Home shows up to three featured stories; falls back to the seed set until the
// admin marks DB stories as featured.
const featuredSeeds = storySeeds.filter(s => s.featured).slice(0, 3);

export default function HomePage() {
  const t = useTranslations("home");
  const missions = t.raw("missions").map((m, i) => ({ ...m, ...missionMeta[i] }));
  const tickerItems = t.raw("ticker");
  const [stories, setStories] = useState(featuredSeeds);

  useEffect(() => {
    fetch("/api/stories?featured=1&limit=3")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const items = Array.isArray(data?.items) ? data.items : [];
        if (items.length > 0) setStories(items.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center gradient-mesh overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 mt-[5vh] z-10 w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-rose-300 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                {t("established")}
              </div>

              <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                Aadhar Manuskicha
              </h1>

              <p className="text-xl text-amber-200 font-[family-name:var(--font-heading)] italic mb-4">
                आधार माणुसकीचा
              </p>

              <p className="text-gray-200 text-xl font-medium mb-3">
                {t("heroLeadPrefix")} <span className="text-amber-400 font-bold">{t("heroLeadHighlight")}</span>.
              </p>

              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                {t("heroSubtitle")}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/donate"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Heart size={20} fill="currentColor" />
                  {t("donateNow")}
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  {t("ourStory")}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="bg-slate-900 py-4 overflow-hidden">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-white/90 font-medium">
              {item}
              <span className="text-amber-400">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* IMPACT & REACH */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700">{t("impactLabel")}</span>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-gray-900">{t("impactTitle")}</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {pillars.map((p, i) => (
              <AnimatedSection key={p.labelKey} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center h-full hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                    <p.icon size={24} />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900">{t(p.labelKey)}</h3>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <AnimatedSection key={s.labelKey} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center h-full hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <s.icon size={22} />
                    </div>
                    <div className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-rose-600 mb-2">
                      <Counter from={0} to={s.num} />
                    </div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t(s.labelKey)}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label={t("missionLabel")}
              title={t("missionTitle")}
              description={t("missionDesc")}
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {missions.map((m, i) => (
              <AnimatedSection key={m.title} delay={i * 0.1}>
                <Link href="/focus" className="group block h-full">
                  <div className="bg-white border border-gray-100 rounded-3xl p-7 h-full hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2 transition-all duration-500">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                      <m.icon size={24} />
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-2">
                      {m.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{m.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {m.tags.map((tag) => (
                        <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                  {t("storiesLabel")}
                </span>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-gray-900">
                  {t("storiesTitle")}
                </h2>
              </div>
              <Link href="/stories" className="text-emerald-700 font-semibold text-sm hover:text-emerald-800 flex items-center gap-1 group">
                {t("viewAllStories")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((s, i) => (
              <AnimatedSection key={s._id || s.name} delay={i * 0.1}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-gray-100">
                  <div className={`bg-gradient-to-r ${themeGradient(s.theme)} h-40 flex items-center justify-center relative`}>
                    <span className="text-6xl">{s.icon}</span>
                    <span className={`absolute top-4 right-4 ${tagColor(s.tag)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {s.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-1">{s.name}</h3>
                    <p className="text-gray-400 text-xs mb-3">📍 {s.location}</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.snippet || `${s.background?.replace(/<[^>]*>/g, "").slice(0, 120)}…`}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-emerald-700 font-semibold text-sm">
                        <strong>{t("todayLabel")}</strong> {s.outcome}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION CTA */}
      <section className="relative py-24 gradient-mesh-gold overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <AnimatedSection className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-5xl font-bold text-white mb-6">
            {t("ctaTitle")}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("ctaText")}
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
          >
            <Heart size={22} fill="currentColor" />
            {t("donateNow")}
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
