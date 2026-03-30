"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import AnimatedSection from "@/app/components/AnimatedSection";
import SectionHeading from "@/app/components/SectionHeading";
import { motion, animate, useInView } from "framer-motion";
import { BookOpen, Sprout, Stethoscope, Users, ArrowRight, Heart, GraduationCap, Briefcase, Landmark, MapPin, Sparkles } from "lucide-react";

const stats = [
  { num: 23, label: "Years of Service", icon: Landmark, color: "from-amber-500 to-orange-500" },
  { num: 1200, label: "Students Supported", icon: GraduationCap, color: "from-blue-500 to-indigo-500" },
  { num: 25, label: "Villages Reached", icon: MapPin, color: "from-emerald-500 to-teal-500" },
  { num: 3000, label: "Lives Changed", icon: Sparkles, color: "from-rose-500 to-pink-500" },
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

const missions = [
  { icon: BookOpen, title: "Education", desc: "Scholarships, educational materials, and dropout prevention for underprivileged children.", color: "from-blue-500 to-cyan-500", tags: ["Scholarships", "Supplies"] },
  { icon: Sprout, title: "Rural Development", desc: "Empowering farming families with sustainable agriculture and government scheme access.", color: "from-emerald-500 to-green-500", tags: ["Farmers", "Infrastructure"] },
  { icon: Stethoscope, title: "Healthcare", desc: "Free medical, eye, and blood donation camps bringing healthcare to villages.", color: "from-rose-500 to-pink-500", tags: ["Medical Camps", "Awareness"] },
  { icon: Users, title: "Women Empowerment", desc: "Self-help groups, vocational training, and legal literacy for rural women.", color: "from-purple-500 to-violet-500", tags: ["Bachat Gats", "Training"] },
];

const stories = [
  { name: "Raju Bhosale", icon: "👨🏽‍🎓", tag: "Education", tagColor: "bg-blue-500", location: "Farmer's son, Beed", snippet: "Was near dropping out due to financial crisis. Received full scholarship and mentoring.", outcome: "B.Tech Engineer in Pune", gradient: "from-teal-400 to-blue-500" },
  { name: "Sunita Waghmare", icon: "👩🏽‍⚕️", tag: "Health", tagColor: "bg-rose-500", location: "Landless family, Ambajogai", snippet: "Faced early marriage pressure. We intervened with counseling and financial support.", outcome: "BSc Nursing at Govt Hospital", gradient: "from-orange-400 to-rose-500" },
  { name: "Kavita Pawar", icon: "🧵", tag: "Women Emp.", tagColor: "bg-purple-500", location: "2-acre rain-fed farm", snippet: "Struggled with farm debt. Received vocational tailoring training and a sewing machine.", outcome: "Owns boutique, employs 3 women", gradient: "from-purple-400 to-violet-500" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center gradient-mesh overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 mt-[5vh] z-10 w-full text-center">
            {/* Centered Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-rose-300 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                Est. 18 July 2001 · Ambajogai, Maharashtra
              </div>

              <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                Aadhar Manuskicha
              </h1>

              <p className="text-xl text-amber-200 font-[family-name:var(--font-heading)] italic mb-4">
                आधार माणुसकीचा
              </p>

              <p className="text-gray-200 text-xl font-medium mb-3">
                Every Life Deserves a <span className="text-amber-400 font-bold">Strong Aadhar</span>.
              </p>

              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Inspired by Sant Gadgebaba, we transform rural lives through education, healthcare, women empowerment, and sustainable community development in Marathwada.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/donate"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Heart size={20} fill="currentColor" />
                  Donate Now
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  Our Story
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <div className="bg-slate-900 py-4 overflow-hidden">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          {["Education & Literacy", "Farmer Welfare", "Free Medical Camps", "Women's Self-Help Groups", "Youth Skill Development", "Disaster Relief", "Education & Literacy", "Farmer Welfare", "Free Medical Camps", "Women's Self-Help Groups"].map((item, i) => (
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
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700">Our Impact</span>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-gray-900">Making a Real Difference</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: BookOpen, label: "Education", color: "from-blue-500 to-cyan-500" },
              { icon: Sprout, label: "Rural Dev", color: "from-emerald-500 to-green-500" },
              { icon: Stethoscope, label: "Health", color: "from-rose-500 to-pink-500" },
              { icon: Users, label: "Women", color: "from-purple-500 to-violet-500" },
            ].map((p, i) => (
              <AnimatedSection key={p.label} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center h-full hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                    <p.icon size={24} />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900">{p.label}</h3>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center h-full hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <s.icon size={22} />
                    </div>
                    <div className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-rose-600 mb-2">
                      <Counter from={0} to={s.num} />
                    </div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{s.label}</div>
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
              label="Why We Exist"
              title="Our Core Mission"
              description="We work at the grassroots level to address the most pressing challenges faced by rural communities in Marathwada."
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
                      {m.tags.map((t) => (
                        <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                          {t}
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
                  Real Impact
                </span>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-gray-900">
                  Stories of Change
                </h2>
              </div>
              <Link href="/stories" className="text-emerald-700 font-semibold text-sm hover:text-emerald-800 flex items-center gap-1 group">
                View All Stories
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((s, i) => (
              <AnimatedSection key={s.name} delay={i * 0.1}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-gray-100">
                  <div className={`bg-gradient-to-r ${s.gradient} h-40 flex items-center justify-center relative`}>
                    <span className="text-6xl">{s.icon}</span>
                    <span className={`absolute top-4 right-4 ${s.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {s.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-1">{s.name}</h3>
                    <p className="text-gray-400 text-xs mb-3">📍 {s.location}</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.snippet}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-emerald-700 font-semibold text-sm">
                        <strong>Today:</strong> {s.outcome}
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
            Your ₹500 Can Change a Child&apos;s Future
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Every contribution, no matter the size, directly supports our grassroots initiatives. Join us in making humanity the greatest wealth.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
          >
            <Heart size={22} fill="currentColor" />
            Donate Now
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
