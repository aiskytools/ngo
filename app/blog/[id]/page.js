"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import AnimatedSection from "@/app/components/AnimatedSection";
import { ArrowLeft, Share2, Calendar, Tag } from "lucide-react";

const defaultPosts = {
  pre1: { _id: "pre1", title: "Annual Scholarship Distribution 2024", category: "Education", createdAt: "2024-12-15", image: "", description: "This year, Aadhar Manuskicha distributed scholarships to over 120 students from underprivileged families across Beed district. The ceremony was held at our Ambajogai office, attended by local educators, parents, and community leaders.\n\nThe scholarship recipients come from diverse backgrounds — children of daily wage laborers, marginal farmers, and single-parent households. Each scholarship covers tuition fees, books, uniforms, and additional support for competitive exam preparation.\n\nKey highlights:\n• 120 students received scholarships worth ₹5,000 to ₹25,000 each\n• 15 students who received full support are now in professional colleges\n• Special recognition for 5 students who scored above 90% in their board exams\n• Guest speaker: District Collector, Beed district\n\nThe scholarship program has been running continuously since 2005 and has supported over 1,500 students to date." },
  pre2: { _id: "pre2", title: "Free Medical Camp — 240 Patients Treated", category: "Health", createdAt: "2024-11-20", image: "", description: "In partnership with the District Government Hospital, we organized a massive free medical camp in Jogaiwadi. Over 240 patients received free consultations, diagnostics, and medicines.\n\nThe camp was held on 20 November 2024 at our community center. Doctors from various specialties volunteered their time.\n\nServices provided:\n• General health check-ups for 240+ patients\n• Eye examinations and free spectacles for 45 patients\n• Dental check-ups and extractions\n• Blood sugar, blood pressure, and BMI testing\n• Free medicine distribution worth ₹1,50,000\n• Health awareness sessions on nutrition and hygiene\n\nWe thank all the doctors, nurses, and volunteers who made this camp possible." },
  pre3: { _id: "pre3", title: "Flood Relief — 120 Families Supported", category: "Relief", createdAt: "2024-08-10", image: "", description: "When severe floods hit multiple villages in Beed district last monsoon, our volunteer network was among the first to respond. Within 48 hours, we distributed emergency food kits to 120 affected families.\n\nThe floods displaced hundreds of families across Ambajogai, Kaij, and Dharur talukas. Our relief operations ran from 10–25 August 2024.\n\nRelief distributed:\n• 120 emergency food kits (rice, dal, oil, sugar, tea for 1 week)\n• 60 tarpaulin sheets for temporary shelter\n• 200 blankets and bed sheets\n• Clean drinking water bottles (2,000 liters)\n• Basic medicines and first aid kits\n\nWe are grateful to our donors and volunteers who enabled this rapid response." },
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(() => (id && defaultPosts[id]) || null);
  const [loading, setLoading] = useState(() => !!id && !defaultPosts[id]);

  useEffect(() => {
    if (!id || defaultPosts[id]) return;
    fetch(`/api/blogs/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const share = () => {
    if (typeof window === "undefined" || !post) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.description?.substring(0, 200), url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  if (!post) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2><Link href="/blog" className="text-amber-600 font-semibold">← Back to Blog</Link></div>;

  const catColors = { Education: "bg-blue-500", Health: "bg-rose-500", Relief: "bg-orange-600", Event: "bg-amber-500", General: "bg-gray-600" };

  return (
    <>
      {/* Hero */}
      <section className={`relative pt-32 pb-20 overflow-hidden ${post.image ? "" : "gradient-mesh"}`}>
        {post.image && (
          <>
            <Image src={post.image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-6 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Link>
            <span className={`inline-block ${catColors[post.category] || catColors.General} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>{post.category}</span>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Tag size={14} /> {post.category}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {post.description}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
              <button onClick={share} className="px-6 py-3 bg-gray-950 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"><Share2 size={16} /> Share This Post</button>
              <Link href="/blog" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">← More Posts</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
