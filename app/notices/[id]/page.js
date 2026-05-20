"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AnimatedSection from "@/app/components/AnimatedSection";
import { ArrowLeft, Share2, Calendar, Tag } from "lucide-react";

const defaultNotices = {
  n1: { _id: "n1", title: "Sant Gadgebaba Birth Anniversary Celebration", date: "2025-02-23", type: "Event", description: "Join us for the annual celebration of Sant Gadgebaba Jayanti with a community gathering, cleanliness drive, and cultural program at our Ambajogai office.\n\nThe event is scheduled for 23 February 2025 at our main office in Shivajinagar, Bank Colony, Jogaiwadi, Ambajogai.\n\nProgram Schedule:\n• 8:00 AM — Community Cleanliness Drive (Sant Gadgebaba's core message)\n• 10:00 AM — Garlanding ceremony and tribute\n• 11:00 AM — Guest lectures on Sant Gadgebaba's teachings\n• 1:00 PM — Community lunch (Maha-prasad)\n• 3:00 PM — Cultural performances by local school children\n\nAll community members are warmly invited to attend. No registration required." },
  n2: { _id: "n2", title: "Scholarship Application Open 2025–26", date: "2025-03-01", type: "Update", description: "Applications for the annual Aadhar Manuskicha Scholarship for 2025–26 are now open.\n\nEligibility:\n• Students from 8th to 12th standard\n• Family income below ₹2,00,000 per annum\n• Must be domiciled in Beed district\n• Minimum 60% marks in previous exam\n\nDocuments Required:\n• Marksheet of last exam\n• Income certificate\n• Aadhaar card\n• Passport-size photograph\n• Bank account details\n\nLast date for submission: 30 April 2025\n\nSubmit applications at our Ambajogai office or email to santgadgebabango1@gmail.com" },
  n3: { _id: "n3", title: "Volunteer Recruitment Drive", date: "2025-04-15", type: "Program", description: "We are looking for passionate volunteers for the upcoming year. If you are based in or around Ambajogai and wish to contribute — reach out to us.\n\nWe need volunteers for:\n• Teaching and tutoring underprivileged children\n• Health camp organization and coordination\n• Event management and documentation\n• Social media and digital outreach\n• Fundraising and donor coordination\n\nTime commitment: Minimum 4 hours per week\n\nBenefits:\n• Certificate of volunteering\n• Training and skill development\n• Networking with social workers and NGOs\n• A profound sense of purpose\n\nContact: +91 9422242106 or visit our office." },
};

const typeColors = { Event: "bg-blue-500", Invitation: "bg-amber-500", Program: "bg-emerald-600", Urgent: "bg-red-600", Update: "bg-gray-600" };

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(() => (id && defaultNotices[id]) || null);
  const [loading, setLoading] = useState(() => !!id && !defaultNotices[id]);

  useEffect(() => {
    if (!id || defaultNotices[id]) return;
    fetch(`/api/notices/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setNotice(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const share = () => {
    if (typeof window === "undefined" || !notice) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: notice.title, text: notice.description?.substring(0, 200), url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  if (!notice) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><h2 className="text-2xl font-bold text-gray-900 mb-4">Notice Not Found</h2><Link href="/notices" className="text-amber-600 font-semibold">← Back to Notices</Link></div>;

  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Link href="/notices" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-6 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Notices
            </Link>
            <span className={`inline-block ${typeColors[notice.type] || typeColors.Update} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>{notice.type}</span>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">{notice.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(notice.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Tag size={14} /> {notice.type}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {notice.description}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
              <button onClick={share} className="px-6 py-3 bg-gray-950 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"><Share2 size={16} /> Share This Notice</button>
              <Link href="/notices" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">← More Notices</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
