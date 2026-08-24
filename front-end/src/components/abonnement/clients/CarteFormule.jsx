import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const CarteFormule = ({ plan, tarif, estActuel, onClick, index }) => {
  if (!tarif) return null;
  const isPremium = plan === 'premium';

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.6, ease: EASE }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ willChange: 'transform' }}
      className="relative w-full max-w-[280px] sm:w-64 rounded-3xl border p-6 sm:p-7 text-left backdrop-blur-sm transition-colors duration-300"
    >
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          backgroundColor: isPremium ? 'rgba(201,169,110,0.06)' : 'rgba(255,255,255,0.03)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: isPremium ? 'rgba(201,169,110,0.28)' : 'rgba(255,255,255,0.08)',
        }}
      />

      <div className="relative">
        {isPremium && (
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 font-mono text-[8px] uppercase tracking-[0.2em]"
            style={{ backgroundColor: 'rgba(201,169,110,0.12)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)' }}
          >
            Recommandé
          </span>
        )}
        {estActuel && (
          <span className="mb-4 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-emerald-300">
            Actuel
          </span>
        )}

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          Formule
        </p>
        <h3 className="mt-1 font-serif text-2xl italic text-white">
          {tarif.plan_label}
        </h3>

        {/* Prix : taille fluide + retour à la ligne autorisé pour éviter tout débordement */}
        <div className="mt-6 min-w-0">
          <span
            className="block font-serif text-white leading-tight break-words"
            style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.25rem)' }}
          >
            {tarif.prix} Ar
          </span>
        </div>
        <p className="mt-1 font-sans text-xs text-white/35">{tarif.duree_label}</p>

        <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
          Voir les détails
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left rounded-b-3xl"
        style={{ backgroundColor: isPremium ? '#c9a96e' : '#aec3b0' }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </motion.button>
  );
};

export default CarteFormule;