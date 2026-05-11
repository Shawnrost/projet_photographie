import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, TrendingUp, Layers, Award, Zap } from 'lucide-react';

const features = [
  { icon: Layers,        title: "Vente & Licences",     desc: "Contrats automatisés pour chaque vente. Droits d'auteur numériques et paiement sécurisé en ariary.", color: "#38bdf8" },
  { icon: MessageCircle, title: "Chat Instantané",       desc: "Messagerie en temps réel entre photographes et clients. Partagez des briefs sans quitter la plateforme.", color: "#f472b6" },
  { icon: TrendingUp,    title: "Statistiques Live",     desc: "Tableau de bord analytique : vues, coups de cœur, clics. Comprenez votre audience en temps réel.", color: "#34d399" },
  { icon: ShieldCheck,   title: "Blockchain",            desc: "Chaque œuvre est ancrée sur la blockchain. Certificat d'authenticité infalsifiable sur chaque pixel.", color: "#a78bfa" },
  { icon: Award,         title: "Profil Certifié",       desc: "Badge exclusif après validation éditoriale. Rejoignez l'élite photographique malgache.", color: "#fb923c" },
  { icon: Zap,           title: "Missions Flash",        desc: "Les clients publient des missions urgentes. Répondez en secondes, décrochez des contrats événementiels.", color: "#facc15" },
];

const card = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const Features = () => (
  <section className="bg-[#040a14] py-28 overflow-hidden" id="features">

    {/* Static gradient accents — no animation, GPU-friendly */}
    <div className="absolute left-1/4 top-20 w-72 h-72 rounded-full opacity-[0.07] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)' }} />
    <div className="absolute right-1/4 bottom-20 w-60 h-60 rounded-full opacity-[0.06] pointer-events-none"
      style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />

    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

    <div className="container mx-auto px-6 relative z-10">

      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="font-mono text-sky-400 text-xs tracking-[0.5em] uppercase mb-4">✦ Fonctionnalités ✦</p>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-5">
          UNE ARCHITECTURE<br />
          <span className="font-light italic text-sky-400">pensée pour réussir</span>
        </h2>
        <p className="text-white/40 max-w-lg mx-auto text-base leading-relaxed font-light">
          Tout ce dont un photographe professionnel a besoin — dans un seul écosystème conçu pour Madagascar.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              variants={card}
              className="group p-7 rounded-2xl border border-white/[0.07] bg-white/[0.03] cursor-default esary-card"
              style={{ willChange: 'transform' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                <Icon size={22} style={{ color: f.color }} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2 tracking-tight">{f.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              {/* Hover line — CSS transition, not framer */}
              <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full" style={{ backgroundColor: f.color }} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55 }}
        className="mt-16 rounded-3xl p-14 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f172a,#0c4a6e,#0f172a)' }}
      >
        <div className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,#38bdf8 0%,transparent 50%),radial-gradient(circle at 80% 50%,#a78bfa 0%,transparent 50%)' }} />
        <p className="relative text-sky-400 font-mono text-xs tracking-[0.4em] uppercase mb-3">✦ Offre de lancement ✦</p>
        <h3 className="relative text-white text-4xl font-black tracking-tighter mb-3">
          30 jours d'essai <span className="italic font-light text-sky-400">gratuit</span>
        </h3>
        <p className="relative text-white/40 mb-8 text-base">Sans carte bancaire. Sans engagement. Juste votre talent.</p>
        <button className="relative px-10 py-3.5 bg-sky-500 text-white font-bold rounded-full text-base esary-btn">
          Commencer maintenant →
        </button>
      </motion.div>
    </div>
  </section>
);

export default Features;
