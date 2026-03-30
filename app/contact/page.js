"use client";
import AnimatedSection from "@/app/components/AnimatedSection";
import { MapPin, Phone, Mail, Globe, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Whether you have questions, want to volunteer, or wish to partner with us — reach out.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            {/* Info */}
            <AnimatedSection>
              <div className="text-white rounded-3xl p-8 shadow-2xl h-full" style={{ backgroundColor: "#432723" }}>
                <h3 className="text-amber-400 font-bold text-lg mb-1">Reach Us</h3>
                <p className="text-gray-400 text-sm mb-8">We are always happy to connect with people who share our vision.</p>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, label: "Address", value: "Shivajinagar, Bank Colony, Jogaiwadi, Ambajogai, Beed – 431517, Maharashtra" },
                    { icon: Phone, label: "Phone", value: "+91 9422242106", href: "tel:+919422242106" },
                    { icon: Mail, label: "Email", value: "santgadgebabango1@gmail.com", href: "mailto:santgadgebabango1@gmail.com" },
                    { icon: Globe, label: "Website", value: "www.santgadgebabango.com", href: "https://www.santgadgebabango.com" },
                  ].map(c => (
                    <div key={c.label} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-amber-400"><c.icon size={18} /></div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{c.label}</div>
                        {c.href ? (
                          <a href={c.href} className="font-semibold text-sm hover:text-amber-400 transition-colors block leading-tight pt-0.5">{c.value}</a>
                        ) : (
                          <span className="font-semibold text-sm text-white block leading-tight pt-0.5">{c.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-3xl overflow-hidden shadow-lg">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.1!2d76.393908!3d18.729091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQzJzQyLjciTiA3NsKwMjMnMzguMSJF!5e0!3m2!1sen!2sin!4v1" width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy" />
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
                <p className="text-gray-500 text-sm mb-8">We typically respond within 24–48 hours.</p>
                <form onSubmit={e => { e.preventDefault(); alert("Thank you! Your message has been received."); e.target.reset(); }} className="space-y-4">
                  <input required placeholder="Full Name *" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input required type="email" placeholder="Email *" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Select a subject...</option>
                    <option>Donation Inquiry</option>
                    <option>Volunteer With Us</option>
                    <option>Partnership Proposal</option>
                    <option>Scholarship Inquiry</option>
                    <option>General Query</option>
                  </select>
                  <textarea required rows={5} placeholder="Write your message here..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                    <Send size={18} /> Send Message
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
