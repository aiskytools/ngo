"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/app/components/AnimatedSection";

const defaultPosts = [
  { _id: "pre1", title: "Annual Scholarship Distribution 2024", category: "Education", createdAt: "2024-12-15", image: "", description: "This year, Aadhar Manuskicha distributed scholarships to over 120 students from underprivileged families across Beed district. The ceremony was held at our Ambajogai office, attended by local educators, parents, and community leaders." },
  { _id: "pre2", title: "Free Medical Camp — 240 Patients Treated", category: "Health", createdAt: "2024-11-20", image: "", description: "In partnership with the District Government Hospital, we organized a massive free medical camp in Jogaiwadi. Over 240 patients received free consultations, diagnostics, and medicines." },
  { _id: "pre3", title: "Flood Relief — 120 Families Supported", category: "Relief", createdAt: "2024-08-10", image: "", description: "When severe floods hit multiple villages in Beed district last monsoon, our volunteer network was among the first to respond. Within 48 hours, we distributed emergency food kits to 120 affected families." },
];

const catIcons = { Education: "📚", Health: "🏥", Relief: "🤝", Event: "📢", General: "📰" };
const catColors = { Education: "bg-blue-500", Health: "bg-rose-500", Relief: "bg-orange-600", Event: "bg-amber-500", General: "bg-gray-600" };

export default function BlogPage() {
  const [posts, setPosts] = useState(defaultPosts);

  useEffect(() => {
    fetch("/api/blogs?limit=50")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const items = Array.isArray(data?.items) ? data.items : [];
        if (items.length > 0) setPosts([...items, ...defaultPosts]);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Blog & Updates</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Stay connected with our latest activities, events, and impact stories.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <AnimatedSection key={post._id} delay={i * 0.05}>
                <Link href={`/blog/${post._id}`} className="block h-full">
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
                    <div className={`h-44 relative flex items-center justify-center ${post.image ? "" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                      {post.image ? (
                        <Image src={post.image} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                      ) : (
                        <span className="text-5xl">{catIcons[post.category] || "📰"}</span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs text-gray-400 mb-2">{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      <span className={`self-start ${catColors[post.category] || catColors.General} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>{post.category}</span>
                      <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-500 text-sm flex-1">{post.description?.substring(0, 120)}...</p>
                      <span className="text-amber-600 font-semibold text-sm mt-4 inline-block">Read More →</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
