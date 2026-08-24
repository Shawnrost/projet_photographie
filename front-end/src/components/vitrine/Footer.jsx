// Footer.jsx
import { useState } from 'react';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Expositions', href: '#expositions' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

// ─────────────────────────────────────────────────────────────────────────
// Petites icônes ligne (sobres, pas d'emoji) cohérentes avec le reste du site
// ─────────────────────────────────────────────────────────────────────────
const IconMail = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 6l10 7 10-7" />
  </svg>
);

const IconPin = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </svg>
);

const IconPhone = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 1-2z" />
  </svg>
);

const IconArrowUp = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const IconArrow = (props) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const Footer = () => {
  const { ref, revealed } = useRevealOnScroll(1, { threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative w-full overflow-hidden bg-black px-6 py-20 md:px-12 md:py-24">
      {/* Ambiance discrète, cohérente avec le reste du site */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-sauge/5 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`relative mx-auto max-w-screen-xl transition-all duration-1000 ease-out ${
          revealed[0] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Grille principale à 4 colonnes */}
        <div className="grid grid-cols-1 gap-14 border-b border-white/10 pb-14 md:grid-cols-12 md:gap-8">
          {/* Colonne marque */}
          <div className="md:col-span-4">
            <span className="font-display text-3xl italic text-white">Gasy Ant'sary</span>
            <p className="mt-4 max-w-xs font-sans text-sm font-light leading-relaxed text-white/60">
              Photographe basé à Fianarantsoa, disponible pour des projets à Madagascar et à l&rsquo;international.
            </p>

            {/* Widget disponibilité */}
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sauge opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sauge" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                Disponible pour nouveaux projets
              </span>
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-8 flex items-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne navigation */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Navigation</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 font-sans text-sm text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="h-px w-3 bg-white/20 transition-all duration-300 group-hover:w-5 group-hover:bg-gold" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne contact */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Contact</h4>
            <ul className="mt-5 flex flex-col gap-3.5">
              <li>
                <a
                  href="mailto:contact@antsary.studio"
                  className="flex items-center gap-3 font-mono text-xs text-white/70 transition-colors duration-300 hover:text-gold"
                >
                  <IconMail className="shrink-0 text-white/40" />
                  contact@antsary.studio
                </a>
              </li>
              <li>
                <a
                  href="tel:+261340000000"
                  className="flex items-center gap-3 font-mono text-xs text-white/70 transition-colors duration-300 hover:text-gold"
                >
                  <IconPhone className="shrink-0 text-white/40" />
                  +261 34 00 000 00
                </a>
              </li>
              <li className="flex items-center gap-3 font-mono text-xs text-white/70">
                <IconPin className="shrink-0 text-white/40" />
                Fianarantsoa, Madagascar
              </li>
            </ul>
          </div>

          {/* Colonne newsletter */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Newsletter</h4>
            <p className="mt-5 font-sans text-sm font-light text-white/60">
              Recevez les nouvelles expositions et séries photo, sans spam.
            </p>

            {subscribed ? (
              <div className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-sauge">
                <span className="h-1.5 w-1.5 rounded-full bg-sauge" />
                Merci, vous êtes inscrit·e
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full min-w-0 border-b border-white/20 bg-transparent py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="S'inscrire à la newsletter"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black"
                >
                  <IconArrow />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="mt-8 flex flex-col-reverse items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-2 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 md:flex-row md:gap-6 md:text-left">
            <span>© {new Date().getFullYear()} Gasy Ant'sary Studio — Tous droits réservés</span>
            <div className="flex items-center gap-6">
              <a href="#" className="transition-colors duration-300 hover:text-white/70">Mentions légales</a>
              <a href="#" className="transition-colors duration-300 hover:text-white/70">Confidentialité</a>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 hover:text-white"
          >
            Haut de page
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-gold group-hover:text-gold">
              <IconArrowUp />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;