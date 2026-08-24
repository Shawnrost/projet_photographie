// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\accueil\BoutonAssistant.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Springs partagés — si tu as déjà SPRING / SPRING_SOFT / SPRING_MORPH /
// SPRING_HOVER dans un fichier de constantes (ex: src/constants/motion.js),
// remplace ce bloc par un import pour rester cohérent avec le reste du projet.
// ---------------------------------------------------------------------------
const SPRING = { type: 'spring', stiffness: 260, damping: 28 };
const SPRING_SOFT = { type: 'spring', stiffness: 170, damping: 26 };
const SPRING_HOVER = { type: 'spring', stiffness: 400, damping: 24 };

const GOLD = '#c9a96e';
const GOLD_LIGHT = '#dcc79a';

// ---------------------------------------------------------------------------
// Icônes trait fin (strokeWidth 1.6) — remplace les emojis par un langage
// visuel cohérent avec MenuArtiste.jsx
// ---------------------------------------------------------------------------

// Obturateur — icône du bouton déclencheur, lames radiales minimalistes
const IconObturateur = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M12 12 12 5.2M12 12 17.9 8.6M12 12 17.9 15.4M12 12 12 18.8M12 12 6.1 15.4M12 12 6.1 8.6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);

const IconAppareil = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 8.5C4 7.67 4.67 7 5.5 7H8l1.2-1.8c.2-.3.5-.5.9-.5h3.8c.4 0 .7.2.9.5L15 7h2.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13C4.67 19 4 18.33 4 17.5v-9Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="12.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M15 9.3h1.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconImage = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="9" cy="10" r="1.4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5.5 16.5 9.5 12.5c.5-.5 1.2-.5 1.7 0L14 15.5M14.5 13.5l1-1c.5-.5 1.2-.5 1.7 0l1.3 1.3"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconFiltre = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 6h14M8 12h8M11 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="9" cy="6" r="1.6" fill="#0f130f" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="15" cy="12" r="1.6" fill="#0f130f" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconCurseur = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 4.5 18 12l-5 1.3L11 19 6 4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const IconCoeur = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 18.5s-6.5-4-6.5-8.6C5.5 7 7.3 5.3 9.6 5.3c1.1 0 2 .5 2.4 1.3.4-.8 1.3-1.3 2.4-1.3 2.3 0 4.1 1.7 4.1 4.6 0 4.6-6.5 8.6-6.5 8.6Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// Personnage — photographe, trait fin, sans expression caricaturale
const IconPhotographe = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="15" r="6" stroke="currentColor" strokeWidth="1.6" />
    <path d="M32 21v15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M20 29c2.8-3.6 6.4-5.4 12-5.4s9.2 1.8 12 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <rect x="23" y="24" width="18" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="32" cy="29.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M27 24.6h-2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M32 36 25 53M32 36l7 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------

const BoutonAssistant = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [etape, setEtape] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const messages = [
    {
      titre: 'Bienvenue sur Gasy Ant’sary',
      contenu: ['Votre guide vous accompagne à travers les œuvres de nos photographes.'],
      Icon: IconAppareil,
    },
    {
      titre: 'Les publications',
      contenu: ['Chaque photographie appartient à un photographe et raconte une histoire qui lui est propre.'],
      Icon: IconImage,
    },
    {
      titre: 'Deux filtres essentiels',
      contenu: [
        'Publicité — les visuels promotionnels de nos photographes.',
        'Vente — les œuvres actuellement proposées à la vente.',
      ],
      Icon: IconFiltre,
    },
    {
      titre: 'Filtrer votre parcours',
      contenu: ['Sélectionnez « Publicité » ou « Vente » sous le bouton pour affiner votre exploration.'],
      Icon: IconCurseur,
    },
    {
      titre: 'Interagir',
      contenu: ['Aimez une photographie, agrandissez-la d’un clic, et partagez celles qui vous marquent.'],
      Icon: IconCoeur,
    },
  ];

  // -------------------------------------------------------------------------
  // Variants — orchestration parent → enfants, pas de rebond
  // -------------------------------------------------------------------------

  const conteneurVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { ...SPRING_SOFT, when: 'beforeChildren', staggerChildren: 0.06, delayChildren: 0.05 },
    },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: SPRING },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.18 } },
  };

  const bulleVariants = {
    hidden: { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0, transition: { ...SPRING_SOFT, delay: 0.08 } },
    exit: { opacity: 0, x: -8, transition: { duration: 0.18 } },
  };

  const contenuVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1, y: 0,
      transition: { when: 'beforeChildren', staggerChildren: 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
  };

  const ligneVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  };

  // -------------------------------------------------------------------------
  // Comportement (inchangé)
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setIsOpen(false);
      setIsVisible(false);
      setEtape(0);
    }, 20000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const avancerEtape = () => {
    if (!isVisible || isAnimating) return;
    if (etape < messages.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setEtape((prev) => prev + 1);
        setIsAnimating(false);
      }, 260);
    } else {
      setTimeout(() => {
        setIsOpen(false);
        setIsVisible(false);
        setEtape(0);
      }, 1200);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setEtape(0);
      setTimeout(() => setIsVisible(true), 80);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsOpen(false);
        setEtape(0);
      }, 260);
    }
  };

  const currentMessage = messages[etape];
  const progress = ((etape + 1) / messages.length) * 100;

  return (
    <>
      {/* Déclencheur — molette 3D, coin haut-droit */}
      <div className="fixed top-6 right-5 sm:top-7 sm:right-7 md:top-8 md:right-10 z-[9999]">
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.08, rotate: 16, y: -2 }}
          whileTap={{ scale: 0.92, rotate: -6, y: 0 }}
          transition={SPRING_HOVER}
          aria-label="Ouvrir le guide"
          className="relative flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 appearance-none border-0 p-0 outline-none select-none"
          style={{
            background: isOpen
              ? `radial-gradient(circle at 34% 28%, #2a2f22 0%, #14180f 62%, #0b0e0a 100%)`
              : `radial-gradient(circle at 34% 28%, #262b23 0%, #12160f 62%, #0a0d09 100%)`,
            boxShadow: isOpen
              ? `inset 0 1.5px 1.5px rgba(255,255,255,0.14), inset 0 -3px 5px rgba(0,0,0,0.65), 0 10px 22px rgba(0,0,0,0.55), 0 0 0 1px ${GOLD}80, 0 0 16px ${GOLD}40`
              : `inset 0 1.5px 1.5px rgba(255,255,255,0.09), inset 0 -3px 5px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.45), 0 0 0 1px rgba(248,249,248,0.14)`,
            color: isOpen ? GOLD : theme?.ivory ?? '#f8f9f8',
          }}
        >
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%)' }}
          />
          <IconObturateur className="w-4 h-4 sm:w-[18px] sm:h-[18px] relative" />
          <span
            className="absolute top-0 right-0 w-2 h-2 rounded-full border-2"
            style={{ backgroundColor: GOLD, borderColor: '#0a0d09', boxShadow: `0 0 6px ${GOLD}` }}
          />
        </motion.button>
      </div>

      {/* Modale du guide — centrée, au-dessus du header */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="voile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={avancerEtape}
            className="fixed inset-0 z-[100000] flex items-center justify-center px-4 cursor-pointer"
            style={{ backgroundColor: 'rgba(8,10,7,0.62)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={conteneurVariants}
              className="relative flex flex-col items-center gap-4 sm:gap-5 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Avatar — photographe, trait fin */}
              <motion.div variants={avatarVariants}>
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#12160f',
                    border: `1px solid ${GOLD}55`,
                    boxShadow: `0 8px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)`,
                    color: GOLD_LIGHT,
                  }}
                >
                  <IconPhotographe className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
              </motion.div>

              {/* Bulle */}
              <motion.div
                variants={bulleVariants}
                onClick={avancerEtape}
                className="relative w-[300px] xs:w-[360px] sm:w-[420px] md:w-[460px] lg:w-[500px] rounded-2xl p-6 sm:p-7 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(15,19,15,0.97)',
                  border: '1px solid rgba(248,249,248,0.08)',
                  boxShadow: `0 30px 80px rgba(0,0,0,0.6)`,
                }}
              >
                {/* Fermer */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                  aria-label="Fermer le guide"
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 w-6 h-6 flex items-center justify-center rounded-full text-[#f8f9f8]/30 hover:text-[#f8f9f8]/70 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Ligne de progression */}
                <div className="w-full h-px bg-white/10 mb-4 overflow-hidden">
                  <motion.div
                    className="h-px"
                    style={{ backgroundColor: GOLD }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className="flex items-center justify-between mb-4 font-mono text-[10px] tracking-[0.15em] uppercase text-[#f8f9f8]/35">
                  <span>Guide — étape {String(etape + 1).padStart(2, '0')}/{String(messages.length).padStart(2, '0')}</span>
                  <span style={{ color: GOLD }}>{Math.round(progress)}%</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={etape} variants={contenuVariants} initial="hidden" animate="visible" exit="exit">
                    <motion.div variants={ligneVariants} className="flex items-center gap-2.5 mb-3" style={{ color: GOLD }}>
                      <currentMessage.Icon className="w-5 h-5" />
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f8f9f8]/40">
                        Guide photo
                      </span>
                    </motion.div>

                    <motion.p
                      variants={ligneVariants}
                      className="font-display text-xl sm:text-2xl text-[#f8f9f8] leading-snug mb-2.5"
                    >
                      {currentMessage.titre}
                    </motion.p>

                    <div className="space-y-1.5">
                      {currentMessage.contenu.map((paragraphe, index) => (
                        <motion.p
                          key={index}
                          variants={ligneVariants}
                          className="font-sans text-sm text-[#f8f9f8]/75 leading-relaxed"
                        >
                          {paragraphe}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Pied */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5">
                  <span className="font-mono text-[10px] tracking-wide text-[#f8f9f8]/30">
                    {etape < messages.length - 1 ? 'Cliquez pour continuer' : 'Fin du guide'}
                  </span>
                  <div className="flex gap-1.5">
                    {messages.map((_, index) => (
                      <span
                        key={index}
                        className="block h-[3px] rounded-full transition-all duration-300"
                        style={{
                          width: index === etape ? 16 : 6,
                          backgroundColor: index === etape ? GOLD : 'rgba(248,249,248,0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BoutonAssistant;