"use client";
import { useState, useEffect } from "react";
import AnimatedSection from "@/app/components/AnimatedSection";
import { storySeeds } from "@/lib/storySeeds";
import { tagColor, themeGradient } from "@/lib/storyMeta";

export default function StoriesPage() {
  const [stories, setStories] = useState(storySeeds);

  useEffect(() => {
    fetch("/api/stories?limit=100")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const items = Array.isArray(data?.items) ? data.items : [];
        if (items.length > 0) setStories(items);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Stories of Change</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Real lives transformed through education, opportunity, and unwavering community support.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((s, i) => (
              <AnimatedSection key={s._id || s.name} delay={i * 0.08}>
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 h-full hover:shadow-xl transition-all duration-500">
                  <div className={`bg-gradient-to-r ${themeGradient(s.theme)} p-6 flex items-center gap-4`}>
                    <span className="text-4xl">{s.icon}</span>
                    <div>
                      <span className={`${tagColor(s.tag)} text-white text-xs font-bold px-3 py-1 rounded-full`}>{s.tag}</span>
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white mt-1">{s.name}</h3>
                      <p className="text-white/70 text-xs">📍 {s.location}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Background</h4>
                      {/* HTML from DB is sanitized on save; seed fallback text is trusted (in-repo). */}
                      <div className="prose prose-sm max-w-none text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: s.background }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">What We Did</h4>
                      <div className="prose prose-sm max-w-none text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: s.intervention }} />
                    </div>
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl p-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">Today</h4>
                      <p className="text-emerald-800 text-sm font-semibold">{s.outcome}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
