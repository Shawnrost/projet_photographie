import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 380, damping: 26 };

const ModalAnnulationAbonnement = ({ estOuvert, onFermer, onConfirmer, chargement }) => (
  <AnimatePresence>
    {estOuvert && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onFermer}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/50 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={SPRING}
          onClick={(e) => e.stopPropagation()}
          style={{ willChange: 'transform' }}
          className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h3 className="mt-4 font-display text-2xl italic text-charcoal">
            Annuler votre abonnement ?
          </h3>
          <p className="mt-2 font-sans text-[13px] leading-relaxed text-charcoal/55">
            Cette action est irréversible. Vous perdrez immédiatement l'accès aux avantages de votre formule actuelle.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onFermer}
              className="flex-1 rounded-full border border-charcoal/15 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/60 transition-colors duration-300 hover:border-charcoal/30"
            >
              Retour
            </button>
            <button
              onClick={onConfirmer}
              disabled={chargement}
              className="flex-1 rounded-full bg-red-500 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-red-600 disabled:opacity-60"
            >
              {chargement ? 'Annulation...' : 'Confirmer'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ModalAnnulationAbonnement;