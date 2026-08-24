import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { href: '#expositions', label: 'Expositions', num: '01' },
  { href: '#univers', label: "L'univers", num: '02' },
  { href: '#formules', label: 'Formules', num: '03' },
  { href: '#contact', label: 'Contact', num: '04' },
];

const EASE = [0.16, 1, 0.3, 1];

// Ressort doux, réutilisé pour toutes les micro-interactions (hover/tap)
// afin d'avoir une signature de mouvement cohérente sur tout le header.
const SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 };
const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 22, mass: 0.7 };

const menuOverlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASE, when: 'beforeChildren', staggerChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: EASE, when: 'afterChildren', staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: 16, transition: { duration: 0.3, ease: EASE } },
};

// Variants du lien desktop : le parent pilote le groupe (numéro + label +
// soulignement) pour que le hover déclenche une animation orchestrée et
// non trois transitions indépendantes désynchronisées.
const navLinkVariants = {
  rest: { y: 0 },
  hover: { y: -2, transition: SPRING_SOFT },
};

const navNumVariants = {
  rest: { opacity: 0.4, color: 'rgba(201, 169, 110, 0.4)' },
  hover: { opacity: 1, color: 'rgba(201, 169, 110, 1)', transition: { duration: 0.35, ease: EASE } },
};

const navLabelVariants = {
  rest: { color: 'rgba(245, 240, 230, 0.8)' },
  hover: { color: 'rgba(255, 255, 255, 1)', transition: { duration: 0.35, ease: EASE } },
};

const navUnderlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.45, ease: EASE } },
};

const EnTete = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(href);
    }
  };

  const handleMobileNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <div className="fixed top-8 left-0 w-full z-50 px-4 md:px-8 pointer-events-none">
        <motion.nav
          initial={{ y: -150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ willChange: 'transform, opacity' }}
          className="pointer-events-auto max-w-screen-xl mx-auto flex justify-between items-center px-8 md:px-12 h-20 bg-charcoal/70 backdrop-blur-2xl border border-gold/15 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        >
          {/* LOGO */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="group flex flex-col pt-1 select-none text-left"
          >
            <span className="font-display text-2xl tracking-wider text-ivory transition-colors duration-500 group-hover:text-gold">
              e<span className="text-gold">.</span>Sary
            </span>
            <span className="font-mono text-[7px] tracking-[0.5em] uppercase text-gold/60 -mt-1">
              Fianarantsoa
            </span>
          </motion.button>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:flex items-center gap-10 lg:gap-12">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: EASE }}
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                className="relative py-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase group flex items-start gap-1 cursor-pointer"
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  variants={navLinkVariants}
                  initial="rest"
                  animate="rest"
                  className="flex items-start gap-1"
                  style={{ willChange: 'transform' }}
                >
                  <motion.span
                    variants={navNumVariants}
                    className="font-mono text-[7px] tracking-normal -mt-0.5"
                  >
                    {link.num}
                  </motion.span>
                  <motion.span variants={navLabelVariants}>{link.label}</motion.span>
                </motion.div>

                {/* Soulignement animé via scaleX (GPU) plutôt que width (layout) */}
                <motion.span
                  variants={navUnderlineVariants}
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-gold/60 origin-left"
                  style={{ willChange: 'transform' }}
                />
              </motion.a>
            ))}
          </div>

          {/* BOUTON ESPACE CLIENT */}
          <div className="hidden md:block">
            <motion.button
              onClick={() => navigate('/connexion')}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              style={{ willChange: 'transform' }}
              className="px-8 py-2.5 rounded-full border border-gold/30 text-gold-light font-sans text-[10px] tracking-[0.3em] uppercase bg-gold/5 backdrop-blur-sm transition-colors duration-500 hover:bg-gold hover:text-charcoal"
            >
              Se Connecter
            </motion.button>
          </div>

          {/* MENU MOBILE — bouton hamburger */}
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
            transition={SPRING}
            className="relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 md:hidden bg-ivory/10 rounded-full border border-ivory/10"
          >
            <motion.span
              className="w-5 h-[1px] bg-ivory block"
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ willChange: 'transform' }}
            />
            <motion.span
              className="w-5 h-[1px] bg-ivory block"
              animate={{ opacity: menuOpen ? 0 : 1, scale: menuOpen ? 0.5 : 1 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ willChange: 'opacity, transform' }}
            />
            <motion.span
              className="w-5 h-[1px] bg-ivory block"
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ willChange: 'transform' }}
            />
          </motion.button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ willChange: 'opacity' }}
            className="fixed inset-0 z-[60] bg-ivory/98 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
          >
            <motion.button
              variants={menuItemVariants}
              onClick={() => setMenuOpen(false)}
              whileTap={{ scale: 0.92 }}
              className="absolute top-10 right-10 text-charcoal font-mono text-xs uppercase tracking-widest"
            >
              Fermer
            </motion.button>

            <div className="flex flex-col items-center gap-7">
              {NAV_LINKS.map((link) => (
                <motion.button
                  key={link.label}
                  variants={menuItemVariants}
                  onClick={() => handleMobileNavClick(link.href)}
                  whileHover={{ x: 8, color: '#c9a96e' }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  style={{ willChange: 'transform' }}
                  className="font-display italic text-5xl text-charcoal"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                variants={menuItemVariants}
                onClick={() => { navigate('/connexion'); setMenuOpen(false); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
                style={{ willChange: 'transform' }}
                className="mt-8 px-10 py-4 rounded-full bg-charcoal text-ivory text-[10px] tracking-[0.3em] uppercase"
              >
                Mon Espace
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnTete;