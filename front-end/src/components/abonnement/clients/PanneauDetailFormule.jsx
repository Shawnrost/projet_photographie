import { motion } from 'framer-motion';
import ToggleDuree from './ToggleDuree';

const EASE = [0.16, 1, 0.3, 1];
const SPRING_HOVER = { type: 'spring', stiffness: 380, damping: 24 };

const AVANTAGES = {
  basic: [
    'Portfolio public illimité',
    'Messagerie avec vos abonnés',
    'Statistiques de base',
  ],
  premium: [
    'Tout Basic, plus :',
    'Mise en avant dans les recherches',
    'Statistiques avancées',
    'Support prioritaire',
  ],
};

const PanneauDetailFormule = ({
  plan,
  tarif,
  dureeActive,
  onChangerDuree,
  estActuel,
  estAdmin,
  estAuthentifie,
  chargementAction,
  onSoumettre,
}) => {
  if (!plan) return null;
  const isPremium = plan === 'premium';
  const avantages = AVANTAGES[plan] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full max-w-md"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/40">
        Récapitulatif
      </p>
      <h2 className="mt-2 font-display text-3xl italic text-charcoal break-words">
        Formule {tarif?.plan_label || (isPremium ? 'Premium' : 'Basic')}
      </h2>

      <div className="mt-6">
        <ToggleDuree dureeActive={dureeActive} onChange={onChangerDuree} variant="light" />
      </div>

      {/* Prix : taille fluide + retour à la ligne autorisé pour éviter tout débordement */}
      <div className="mt-6 flex flex-wrap items-baseline gap-1.5 min-w-0">
        <span
          className="font-display text-charcoal leading-tight break-words"
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}
        >
          {tarif ? `${tarif.prix} Ar` : '—'}
        </span>
        <span className="font-sans text-sm text-charcoal/40 whitespace-nowrap">
          / {tarif?.duree_label || ''}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-charcoal/8 pt-6">
        {avantages.map((a, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={isPremium ? '#c9a96e' : '#1a1a1a'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="mt-0.5 flex-shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-sans text-[13px] leading-snug text-charcoal/70">{a}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={!estActuel && !estAdmin ? { scale: 1.02 } : {}}
        whileTap={!estActuel && !estAdmin ? { scale: 0.97 } : {}}
        transition={SPRING_HOVER}
        disabled={estActuel || estAdmin || chargementAction || !tarif}
        onClick={onSoumettre}
        style={{ willChange: 'transform' }}
        className={`mt-8 w-full rounded-full py-3.5 font-sans text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
          estActuel
            ? 'cursor-not-allowed bg-charcoal/5 text-charcoal/30'
            : isPremium
              ? 'bg-charcoal text-ivory hover:bg-gold hover:text-charcoal'
              : 'border border-charcoal/20 text-charcoal hover:border-gold hover:text-gold-light'
        }`}
      >
        {estActuel
          ? 'Formule actuelle'
          : estAdmin
            ? 'Réservé aux artistes'
            : !estAuthentifie
              ? 'Se connecter pour souscrire'
              : chargementAction
                ? 'Traitement...'
                : 'Confirmer l\'abonnement'}
      </motion.button>
    </motion.div>
  );
};

export default PanneauDetailFormule;