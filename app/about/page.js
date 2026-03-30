import AnimatedSection from "@/app/components/AnimatedSection";
import SectionHeading from "@/app/components/SectionHeading";
import { Eye, Target, Search, Recycle } from "lucide-react";

export const metadata = { title: "About Us | Aadhar Manuskicha" };

const values = [
  { icon: Eye, title: "Vision", desc: "A society where every individual, regardless of background, has access to education, healthcare, and a dignified life." },
  { icon: Target, title: "Mission", desc: "To empower marginalized communities of Marathwada through sustainable grassroots interventions in education, health, and livelihoods." },
  { icon: Search, title: "Transparency", desc: "We maintain 100% financial and operational transparency, ensuring every rupee directly reaches beneficiaries." },
  { icon: Recycle, title: "Sustainability", desc: "Our interventions focus on self-reliance rather than temporary relief or dependency." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">About Us</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Our journey, our inspiration, and our commitment to humanity.</p>
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
                  <span className="text-xs text-gray-500 font-medium">Founded</span>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700">Our Journey</span>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-gray-900 mb-6">Rooted in Marathwada,<br/>Driven by Humanity.</h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>Founded on <strong className="text-gray-900">18 July 2001</strong> in Ambajogai, Beed, Aadhar Manuskicha began with a simple yet profound belief: that every life deserves a strong foundation of dignity and support.</p>
                <p>Our organization was born out of a deep understanding of the unique challenges faced by the people of the Marathwada region—from recurring droughts and agrarian crises to limited access to quality education and healthcare.</p>
                <p>Over the past 23+ years, we have grown from a small group of passionate volunteers into a registered charitable trust that actively impacts thousands of lives across 25+ villages.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading label="Our Values" title="What Drives Us" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-7 text-center h-full border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 text-amber-600">
                    <v.icon size={28} />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
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
            <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white mb-6">Our Guiding Light: Sant Gadgebaba</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              Sant Gadgebaba Sevabhavi Sanstha operates under the profound inspiration of Sant Gadgebaba, a mendicant-saint and social reformer from Maharashtra. He traveled village to village, sweeping streets and preaching cleanliness, eradication of blind faith, and the supreme importance of education.
            </p>
            <p className="font-[family-name:var(--font-heading)] text-3xl text-amber-400 italic mb-4">
              &quot;माणुसकी हीच खरी श्रीमंती&quot;
            </p>
            <p className="text-gray-400 text-sm">(Humanity is the greatest wealth)</p>
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
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900">Adv. Santosh A. Pawar</h3>
                    <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Founder & President</p>
                  </div>
                </div>
                <div className="text-gray-500 leading-relaxed space-y-3 text-sm">
                  <p>An advocate by profession and a social worker by calling, Adv. Santosh Pawar established Aadhar Manuskicha with a vision to provide legal, educational, and social aid to the voiceless.</p>
                  <p>Under his leadership, the organization has prioritized immediate action and transparent operations, building deep trust within the Ambajogai community over the last two decades.</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700">Official Details</span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gray-900 mb-6">Registration & Contact Info</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Registered Name", value: "Sant Gadgebaba Sevabhavi Sanstha" },
                    { label: "Popular Name", value: "Aadhar Manuskicha (आधार माणुसकीचा)" },
                    { label: "Established", value: "18 July 2001" },
                    { label: "Org. Type", value: "Registered Charitable Trust / NGO" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-gray-900 font-semibold text-sm">{item.value}</div>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Registered Office</div>
                    <div className="text-gray-900 font-semibold text-sm">At. Shivajinagar, Bank Colony, Jogaiwadi, Ambajogai, Beed – 431517, Maharashtra</div>
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
