import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';

const plans = [
  {
    name: "Découverte", icon: Star, price: "Gratuit", priceSub: "pour toujours", color: "#94a3b8",
    desc: "Pour commencer à explorer la plateforme.",
    features: [
      { t: "15 photos maximum",           ok: true  },
      { t: "Profil public basique",        ok: true  },
      { t: "Messagerie limitée (5/mois)",  ok: true  },
      { t: "Vente de photos",              ok: false },
      { t: "Badge Certifié",               ok: false },
      { t: "Statistiques avancées",        ok: false },
      { t: "Missions Flash",               ok: false },
    ],
    cta: "Commencer gratuitement", ctaClass: "border border-white/20 text-white hover:bg-white/8", popular: false,
  },
  {
    name: "Exposant", icon: Zap, price: "25 000", priceSub: "ariary / mois", color: "#38bdf8",
    desc: "Le choix de 95 % des photographes actifs.",
    features: [
      { t: "Upload illimité",               ok: true },
      { t: "Vente directe (0% commission)", ok: true },
      { t: "Messagerie illimitée",          ok: true },
      { t: "Badge 'Certifié'",              ok: true },
      { t: "Statistiques en temps réel",    ok: true },
      { t: "Accès aux Missions Flash",      ok: true },
      { t: "Support prioritaire",           ok: false },
    ],
    cta: "Essai gratuit 30 jours", ctaClass: "bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/25", popular: true,
  },
  {
    name: "Studio", icon: Crown, price: "75 000", priceSub: "ariary / mois", color: "#a78bfa",
    desc: "Pour les studios et agences photographiques.",
    features: [
      { t: "Tout l'Exposant +",          ok: true },
      { t: "5 sous-comptes photographes", ok: true },
      { t: "Facturation automatique",    ok: true },
      { t: "API d'intégration",          ok: true },
      { t: "Manager dédié",              ok: true },
      { t: "Formation onboarding",       ok: true },
      { t: "Support 24/7",               ok: true },
    ],
    cta: "Contacter l'équipe", ctaClass: "border border-violet-400/30 text-violet-300 hover:bg-violet-500/8", popular: false,
  },
];

const card = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const Pricing = () => (
  <section className="bg-[#040a14] py-28" id="tarifs">
    <div className="container mx-auto px-6">

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-violet-400 text-xs tracking-[0.5em] uppercase mb-4">✦ Abonnements ✦</p>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-4">
          INVESTISSEZ DANS<br /><span className="font-light italic text-violet-400">votre carrière</span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto text-base leading-relaxed">
          Commencez gratuitement. Évoluez sans limite. Aucune commission.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.09 }}
      >
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={i}
              variants={card}
              className={`relative rounded-3xl p-8 flex flex-col esary-card ${plan.popular ? 'border-2 bg-gradient-to-b from-slate-800 to-slate-900' : 'border border-white/[0.07] bg-white/[0.03]'}`}
              style={{ borderColor: plan.popular ? `${plan.color}50` : undefined, willChange: 'transform' }}
            >
              {plan.popular && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-0.5 rounded-b-2xl text-xs font-bold uppercase tracking-widest"
                  style={{ backgroundColor: plan.color, color: '#040a14' }}>
                  ✦ Populaire
                </div>
              )}

              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}18`, border: `1px solid ${plan.color}28` }}>
                  <Icon size={19} style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-white font-bold">{plan.name}</h3>
                  <p className="text-white/30 text-xs">{plan.desc}</p>
                </div>
              </div>

              <div className="mb-7">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Gratuit' && <span className="text-white/30 text-sm">Ar</span>}
                </div>
                <p className="text-white/25 text-xs mt-0.5">{plan.priceSub}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-7">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2.5 text-sm">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={f.ok ? { backgroundColor: `${plan.color}20`, border: `1px solid ${plan.color}35` } : { backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      {f.ok && <Check size={10} style={{ color: plan.color }} />}
                    </span>
                    <span className={f.ok ? 'text-white/75' : 'text-white/20 line-through'}>{f.t}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-colors duration-200 ${plan.ctaClass}`}>
                {plan.cta}
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-white/20 text-xs mt-10 font-mono"
      >
        ✦ MVola · Orange Money · Carte bancaire ✦
      </motion.p>
    </div>
  </section>
);

export default Pricing;
