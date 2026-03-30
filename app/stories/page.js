import AnimatedSection from "@/app/components/AnimatedSection";

export const metadata = { title: "Stories of Change | Aadhar Manuskicha" };

const stories = [
  { name: "Raju Bhosale", icon: "👨🏽‍🎓", gradient: "from-teal-400 to-blue-500", tag: "Education", tagColor: "bg-blue-500", location: "Farmer's son, Beed District", bg: "Son of a marginal farmer with 2 acres of rain-fed land and three siblings. The family could barely afford one meal a day during drought years.", intervention: "Aadhar Manuskicha provided a full scholarship covering tuition, books, uniforms, and hostel fees. Our mentors guided him through 11th, 12th, and engineering entrance preparation.", outcome: "B.Tech Engineer working at an IT firm in Pune. He now sponsors one student annually through our organization." },
  { name: "Sunita Waghmare", icon: "👩🏽‍⚕️", gradient: "from-orange-400 to-rose-500", tag: "Health", tagColor: "bg-rose-500", location: "Landless family, Ambajogai", bg: "Born into a landless Dalit family, Sunita faced immense pressure for early marriage at age 15. Her parents saw no value in further education for a girl.", intervention: "Our women's cell counseled her parents extensively. We arranged full financial support for her BSc Nursing course and provided study materials.", outcome: "BSc Nursing graduate, now working at a Government Hospital. First woman in her family to earn a professional degree." },
  { name: "Pravin Kale", icon: "📚", gradient: "from-amber-400 to-orange-500", tag: "Education", tagColor: "bg-blue-500", location: "Daily wage laborer's son, Kaij", bg: "Pravin's father worked as a daily wage laborer earning ₹200/day. Despite being academically brilliant, he had no access to competitive exam coaching.", intervention: "We provided free MPSC study materials, connected him with a mentor, and covered exam fees and travel costs for three consecutive attempts.", outcome: "Cleared MPSC examination and is now a Government Officer. He actively mentors other rural youth through our programs." },
  { name: "Kavita Pawar", icon: "🧵", gradient: "from-purple-400 to-violet-500", tag: "Women Emp.", tagColor: "bg-purple-500", location: "2-acre rain-fed farm, Dharur", bg: "With only a 2-acre rain-fed farm and mounting debts after consecutive droughts, Kavita's family was in deep financial crisis.", intervention: "Through our women's vocational training program, Kavita received 6 months of professional tailoring training and was provided a sewing machine.", outcome: "Owns a boutique in Ambajogai, employs 3 other women, and earns ₹15,000–20,000/month. Now debt-free." },
  { name: "Sagar Shinde", icon: "🩺", gradient: "from-cyan-400 to-teal-500", tag: "Education", tagColor: "bg-blue-500", location: "Widowed mother, Latur", bg: "After losing his father to suicide due to farm debt, Sagar lived with his widowed mother who worked as a domestic helper.", intervention: "Aadhar Manuskicha arranged a full scholarship for NEET coaching, covered all exam fees, and provided emotional counseling support.", outcome: "Currently a student at a Government Medical College. Aims to return to rural Maharashtra as a doctor." },
  { name: "Meena Jadhav", icon: "💼", gradient: "from-emerald-400 to-green-500", tag: "Education", tagColor: "bg-blue-500", location: "Farm debt crisis family, Beed", bg: "Meena's family was caught in a severe farm debt crisis. She had completed her graduation but saw no path forward.", intervention: "We funded her MBA entrance coaching and tuition fees. Our career guidance cell helped with mock interviews and resume building.", outcome: "MBA completed, now working as an HR Manager in Pune. Contributes ₹5,000 monthly to our scholarship fund." },
];

export default function StoriesPage() {
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
              <AnimatedSection key={s.name} delay={i * 0.08}>
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 h-full hover:shadow-xl transition-all duration-500">
                  <div className={`bg-gradient-to-r ${s.gradient} p-6 flex items-center gap-4`}>
                    <span className="text-4xl">{s.icon}</span>
                    <div>
                      <span className={`${s.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>{s.tag}</span>
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white mt-1">{s.name}</h3>
                      <p className="text-white/70 text-xs">📍 {s.location}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Background</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.bg}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">What We Did</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.intervention}</p>
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
