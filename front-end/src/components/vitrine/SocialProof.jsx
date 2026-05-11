import { motion } from 'framer-motion';
import { Star, Shield } from 'lucide-react';

const photographers = [
  { name: "Rakoto A.",  role: "Photographe de mariage",  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", revenue: "1.2M Ar/mois", rating: 4.9, reviews: 124, badge: "✦ Top vendeur", color: "#38bdf8" },
  { name: "Vola R.",    role: "Photographe de mode",     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", revenue: "980K Ar/mois", rating: 5.0, reviews: 89,  badge: "✦ Certifié",   color: "#f472b6" },
  { name: "Jean-Luc R.",role: "Fine Art & Patrimoine",   avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", revenue: "2.4M Ar/mois", rating: 4.8, reviews: 203, badge: "✦ Elite",       color: "#34d399" },
  { name: "Miora R.",   role: "Nature & Faune",          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", revenue: "650K Ar/mois", rating: 4.9, reviews: 67,  badge: "✦ Montant",    color: "#a78bfa" },
];

const testimonials = [
  { text: "e-Sary a transformé ma passion en véritable carrière. En 3 mois, j'ai gagné 10x ce que je gagnais en studio.", author: "Rakoto Andriantsoa", role: "Photographe professionnel, Antananarivo" },
  { text: "La messagerie avec les clients est incroyable. J'ai décroché un contrat événementiel grâce aux Missions Flash.", author: "Vola Ramiandrisoa",   role: "Photographe de mode, Toamasina" },
  { text: "La blockchain pour protéger mes photos, c'est ce qui m'a décidé. Enfin une plateforme qui respecte nos droits.", author: "Jean-Luc Rajaonarison", role: "Artiste photographe, Fianarantsoa" },
];

const item = {
  hidden: { opacity: 0, y: 35 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

const SocialProof = () => (
  <section className="bg-[#04070d] py-28" id="photographes">
    <div className="container mx-auto px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-emerald-400 text-xs tracking-[0.5em] uppercase mb-4">✦ Communauté ✦</p>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
          ILS ONT CHOISI<br /><span className="font-light italic text-emerald-400">e-Sary</span>
        </h2>
      </motion.div>

      {/* Photographer cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {photographers.map((ph, i) => (
          <motion.div
            key={i}
            variants={item}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] esary-card"
            style={{ willChange: 'transform' }}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="relative shrink-0">
                <img src={ph.avatar} alt={ph.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#04070d]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-white font-bold text-sm">{ph.name}</h4>
                  <Shield size={12} style={{ color: ph.color }} />
                </div>
                <p className="text-white/40 text-xs">{ph.role}</p>
              </div>
            </div>
            <div className="flex justify-between items-end border-t border-white/[0.06] pt-4">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Revenus</p>
                <p className="font-bold" style={{ color: ph.color }}>{ph.revenue}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold text-sm">{ph.rating}</span>
                </div>
                <p className="text-white/30 text-xs">{ph.reviews} avis</p>
              </div>
            </div>
            <span className="mt-4 block text-center text-xs font-mono py-1 rounded-full"
              style={{ color: ph.color, backgroundColor: `${ph.color}12`, border: `1px solid ${ph.color}25` }}>
              {ph.badge}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={item}
            className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] relative overflow-hidden"
          >
            <span className="absolute top-3 right-5 text-7xl font-black text-white/[0.04] leading-none select-none">"</span>
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, si) => <Star key={si} size={13} className="text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-white/65 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
            <p className="text-white font-bold text-sm">{t.author}</p>
            <p className="text-white/30 text-xs mt-0.5">{t.role}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SocialProof;
