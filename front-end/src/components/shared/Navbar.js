import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Menu, X } from 'lucide-react';

const navLinks = [
  { label: "Galerie",        href: "#galerie" },
  { label: "Photographes",   href: "#photographes" },
  { label: "Tarifs",         href: "#tarifs" },
  { label: "À propos",       href: "#apropos" },
];

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full z-50 px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/75 backdrop-blur-lg border-b border-white/[0.06]' : 'bg-transparent'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="container mx-auto flex justify-between items-center">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Camera size={17} className="text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">
              e<span className="text-sky-400">-</span>Sary
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 rounded-lg"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {active === i && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.07] rounded-lg"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-semibold text-white/60 hover:text-white transition-colors px-4 py-2">
              Connexion
            </button>
            <button className="relative overflow-hidden bg-sky-500 text-white px-6 py-2.5 rounded-full text-sm font-bold esary-btn">
              Rejoindre →
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-white p-2 transition-transform active:scale-90"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center gap-7"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                className="text-4xl font-black text-white hover:text-sky-400 transition-colors tracking-tighter"
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              className="mt-4 bg-sky-500 text-white px-10 py-4 rounded-full font-bold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Rejoindre
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
