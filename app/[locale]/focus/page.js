import AnimatedSection from "@/app/components/AnimatedSection";
import SectionHeading from "@/app/components/SectionHeading";
import { Link } from "@/i18n/navigation";
import { BookOpen, Sprout, Stethoscope, Users, Briefcase, HandHeart, Heart } from "lucide-react";

export const metadata = { title: "Focus Areas | Aadhar Manuskicha" };

const areas = [
  { icon: BookOpen, title: "Education & Literacy", color: "from-blue-500 to-cyan-500", desc: "We believe education is the primary tool to break the cycle of poverty.", items: ["Annual full scholarships for meritorious students", "Distribution of books, uniforms, and stationery kits", "Dropout prevention counseling for at-risk families", "Career guidance and mentorship programs"], tags: ["Scholarships", "School Supplies", "Mentorship"] },
  { icon: Sprout, title: "Rural Development", color: "from-emerald-500 to-green-500", desc: "Addressing the core economic engine of Marathwada by supporting farmers.", items: ["Farmer welfare advocacy during agrarian crises", "Facilitating access to government agriculture schemes", "Awareness on sustainable and water-efficient farming", "Village infrastructure and sanitation initiatives"], tags: ["Farmer Welfare", "Sustainability", "Infrastructure"] },
  { icon: Stethoscope, title: "Health & Wellness", color: "from-rose-500 to-pink-500", desc: "Bringing quality healthcare to remote villages, focusing on preventive care.", items: ["Regular free general and specialized eye camps", "Free medicine distribution for common ailments", "Blood donation drives with local hospitals", "Health and hygiene awareness programs in ZP schools"], tags: ["Medical Camps", "Medicine", "Blood Donation"] },
  { icon: Users, title: "Women Empowerment", color: "from-purple-500 to-violet-500", desc: "Fostering financial independence and legal awareness among rural women.", items: ["Formation of Bachat Gats (Self-Help Groups)", "Vocational training (tailoring, beauty parlor, handicrafts)", "Legal literacy regarding women's rights and property laws", "Domestic violence prevention and social advocacy"], tags: ["Bachat Gats", "Vocational Training", "Legal Literacy"] },
  { icon: Briefcase, title: "Youth & Skill Dev", color: "from-amber-500 to-orange-500", desc: "Equipping the youth with modern skills for employment and entrepreneurship.", items: ["Basic computer literacy and digital awareness", "MPSC / competitive exam guidance and materials", "Helpdesk for government employment schemes", "Entrepreneurship mentoring for rural youth"], tags: ["MPSC Guidance", "Digital Literacy", "Govt Schemes"] },
  { icon: HandHeart, title: "Disaster Relief & Aid", color: "from-red-500 to-rose-500", desc: "Acting as first responders during natural or man-made crises.", items: ["Emergency food kit distribution during floods/droughts", "COVID-19 era support (rations, medical facilitation)", "Winter blanket distribution for destitute and homeless", "Local volunteer network for rapid response"], tags: ["Food Aid", "Emergency Relief", "Winter Drives"] },
];

export default function FocusPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 gradient-mesh overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl font-bold text-white mb-4">Our Focus Areas</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Comprehensive, grassroots interventions designed for holistic development in Marathwada.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {areas.map((a, i) => (
              <AnimatedSection key={a.title} delay={i * 0.08}>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white`}>
                      <a.icon size={24} />
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-gray-900">{a.title}</h3>
                  </div>
                  <p className="text-gray-500 mb-5">{a.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {a.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">{t}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <AnimatedSection>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gray-900 mb-4">Support Our Interventions</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">You can support our work broadly, or direct your donation to a specific focus area.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2"><Heart size={18} fill="currentColor" />Make a Donation</Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 rounded-2xl font-semibold hover:bg-emerald-50 transition-all">Partner With Us</Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
