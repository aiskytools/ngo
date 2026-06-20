// Fallback stories shown when the `stories` collection is empty (e.g. fresh deploy).
// Shape matches the DB documents so the public pages render identically whether
// the data comes from MongoDB or from here. `theme` maps to a gradient and `tag`
// to a badge color via lib/storyMeta.js. `featured` items also appear on the home page.

export const storySeeds = [
  {
    _id: "seed-raju", name: "Raju Bhosale", location: "Farmer's son, Beed District",
    tag: "Education", theme: "teal", icon: "👨🏽‍🎓", featured: true,
    snippet: "Was near dropping out due to financial crisis. Received full scholarship and mentoring.",
    background: "Son of a marginal farmer with 2 acres of rain-fed land and three siblings. The family could barely afford one meal a day during drought years.",
    intervention: "Aadhar Manuskicha provided a full scholarship covering tuition, books, uniforms, and hostel fees. Our mentors guided him through 11th, 12th, and engineering entrance preparation.",
    outcome: "B.Tech Engineer working at an IT firm in Pune. He now sponsors one student annually through our organization.",
  },
  {
    _id: "seed-sunita", name: "Sunita Waghmare", location: "Landless family, Ambajogai",
    tag: "Health", theme: "orange", icon: "👩🏽‍⚕️", featured: true,
    snippet: "Faced early marriage pressure. We intervened with counseling and financial support.",
    background: "Born into a landless Dalit family, Sunita faced immense pressure for early marriage at age 15. Her parents saw no value in further education for a girl.",
    intervention: "Our women's cell counseled her parents extensively. We arranged full financial support for her BSc Nursing course and provided study materials.",
    outcome: "BSc Nursing graduate, now working at a Government Hospital. First woman in her family to earn a professional degree.",
  },
  {
    _id: "seed-kavita", name: "Kavita Pawar", location: "2-acre rain-fed farm, Dharur",
    tag: "Women Emp.", theme: "purple", icon: "🧵", featured: true,
    snippet: "Struggled with farm debt. Received vocational tailoring training and a sewing machine.",
    background: "With only a 2-acre rain-fed farm and mounting debts after consecutive droughts, Kavita's family was in deep financial crisis.",
    intervention: "Through our women's vocational training program, Kavita received 6 months of professional tailoring training and was provided a sewing machine.",
    outcome: "Owns a boutique in Ambajogai, employs 3 other women, and earns ₹15,000–20,000/month. Now debt-free.",
  },
  {
    _id: "seed-pravin", name: "Pravin Kale", location: "Daily wage laborer's son, Kaij",
    tag: "Education", theme: "amber", icon: "📚", featured: false,
    snippet: "Academically brilliant but no access to coaching. We funded his MPSC preparation.",
    background: "Pravin's father worked as a daily wage laborer earning ₹200/day. Despite being academically brilliant, he had no access to competitive exam coaching.",
    intervention: "We provided free MPSC study materials, connected him with a mentor, and covered exam fees and travel costs for three consecutive attempts.",
    outcome: "Cleared MPSC examination and is now a Government Officer. He actively mentors other rural youth through our programs.",
  },
  {
    _id: "seed-sagar", name: "Sagar Shinde", location: "Widowed mother, Latur",
    tag: "Education", theme: "cyan", icon: "🩺", featured: false,
    snippet: "Lost his father to farm debt. We funded NEET coaching and counseling.",
    background: "After losing his father to suicide due to farm debt, Sagar lived with his widowed mother who worked as a domestic helper.",
    intervention: "Aadhar Manuskicha arranged a full scholarship for NEET coaching, covered all exam fees, and provided emotional counseling support.",
    outcome: "Currently a student at a Government Medical College. Aims to return to rural Maharashtra as a doctor.",
  },
  {
    _id: "seed-meena", name: "Meena Jadhav", location: "Farm debt crisis family, Beed",
    tag: "Education", theme: "emerald", icon: "💼", featured: false,
    snippet: "A graduate with no path forward. We funded her MBA entrance coaching.",
    background: "Meena's family was caught in a severe farm debt crisis. She had completed her graduation but saw no path forward.",
    intervention: "We funded her MBA entrance coaching and tuition fees. Our career guidance cell helped with mock interviews and resume building.",
    outcome: "MBA completed, now working as an HR Manager in Pune. Contributes ₹5,000 monthly to our scholarship fund.",
  },
];
