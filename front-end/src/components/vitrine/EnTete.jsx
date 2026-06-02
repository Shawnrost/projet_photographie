import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { href: '/', label: 'Expositions', num: '01' },
  { href: '#', label: 'L\'univers', num: '02' },
  { href: '#', label: 'Formules', num: '03' },
];

const EnTete = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-8 left-0 w-full z-50 px-4 md:px-8 pointer-events-none">
        <motion.nav
          initial={{ y: -150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto max-w-screen-xl mx-auto flex justify-between items-center px-8 md:px-12 h-20 bg-sauge/15 backdrop-blur-2xl border border-ivory/15 rounded-[32px] shadow-[0_20px_50px_rgba(28,33,25,0.25)]"
        >
          {/* LOGO */}
          <button onClick={() => navigate('/')} className="group flex flex-col pt-1 select-none text-left">
            <span className="font-display text-2xl tracking-wider text-ivory group-hover:text-gold transition-colors duration-500">
              e<span className="text-gold">.</span>Sary
            </span>
            <span className="font-mono text-[7px] tracking-[0.5em] uppercase text-gold/60 -mt-1">
              Antananarivo
            </span>
          </button>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:flex items-center gap-14">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                className="relative py-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-ivory/80 hover:text-white transition-colors duration-300 group flex items-start gap-1"
              >
                <span className="font-mono text-[7px] text-gold/40 tracking-normal -mt-0.5">{link.num}</span>
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold/60 transition-all duration-500 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* BOUTON ESPACE CLIENT */}
          <div className="hidden md:block">
            <motion.button 
              onClick={() => navigate('/connexion')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2.5 rounded-full border border-gold/30 text-gold-light font-sans text-[10px] tracking-[0.3em] uppercase bg-gold/5 backdrop-blur-sm hover:bg-gold hover:text-charcoal transition-all duration-500"
            >
              Se Connecter
            </motion.button>
          </div>

          {/* MENU MOBILE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 md:hidden bg-ivory/10 rounded-full border border-ivory/10"
          >
            <span className={`w-5 h-[1px] bg-ivory transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-[1px] bg-ivory ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-[1px] bg-ivory transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[60] bg-ivory/98 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
          >
             <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-10 text-charcoal font-mono text-xs uppercase tracking-widest">Fermer</button>
             <div className="flex flex-col items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <button 
                    key={link.label}
                    onClick={() => { navigate(link.href); setMenuOpen(false); }}
                    className="font-display italic text-5xl text-charcoal hover:text-gold transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <button 
                  onClick={() => { navigate('/connexion'); setMenuOpen(false); }}
                  className="mt-8 px-10 py-4 rounded-full bg-charcoal text-ivory text-[10px] tracking-[0.3em] uppercase"
                >
                  Mon Espace
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnTete;