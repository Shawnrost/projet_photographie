import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const SPRING_HOVER = { type: 'spring', stiffness: 380, damping: 24 };

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const CarteAbonnementActif = ({ abonnement, onDemanderAnnulation }) => {
  if (!abonnement) return null;

  const { plan_tarif, jours_restants, date_fin, type } = abonnement;
  const label = plan_tarif?.plan_label || type;
  const urgence = jours_restants <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm md:flex-row md:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-white/5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
            Abonnement en cours
          </p>
          <h3 className="mt-0.5 font-serif text-lg italic text-white">
            Formule {label}
          </h3>
          <p className="mt-0.5 font-sans text-xs text-white/40">
            Valide jusqu'au {formatDate(date_fin)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em]"
          style={{
            borderColor: urgence ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)',
            backgroundColor: urgence ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)',
            color: urgence ? '#f87171' : '#34d399',
          }}
        >
          {jours_restants} jour{jours_restants > 1 ? 's' : ''} restant{jours_restants > 1 ? 's' : ''}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={SPRING_HOVER}
          onClick={onDemanderAnnulation}
          style={{ willChange: 'transform' }}
          className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-300 hover:border-red-400/30 hover:text-red-400"
        >
          Annuler
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CarteAbonnementActif;