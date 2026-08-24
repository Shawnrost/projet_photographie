// HeroSection.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const EASE = [0.16, 1, 0.3, 1];

// Graines thématiques : nature, architecture, portraits, matière, voyage...
// picsum.photos/seed/{graine} renvoie TOUJOURS une image valide pour n'importe
// quelle graine — contrairement à des ID Unsplash ponctuels, ça ne casse jamais.
const SEED_POOL = [
  'foret-brume', 'sommet-alpin', 'lac-miroir', 'dune-desert', 'cote-rocheuse',
  'tour-verre', 'facade-beton', 'skyline-nuit', 'escalier-moderne', 'toit-terrasse',
  'regard-portrait', 'profil-lumiere', 'silhouette-atelier', 'main-argile',
  'texture-marbre', 'ruelle-pave', 'pont-metal', 'vitrine-nuit', 'quai-brouillard',
];

const SLIDE_COUNT = 6;
const SLIDE_DURATION = 5200;

// Variantes de transition — une par image, jamais deux fois de suite identiques.
const TRANSITIONS = [
  {
    name: 'fondu-zoom',
    initial: { opacity: 0, scale: 1.16 },
    animate: { opacity: 1, scale: 1.02 },
    exit: { opacity: 0, scale: 1.06 },
    transition: { opacity: { duration: 1.8, ease: EASE }, scale: { duration: 7, ease: EASE } },
  },
  {
    name: 'glissement-horizontal',
    initial: { opacity: 0, x: 120, scale: 1.08 },
    animate: { opacity: 1, x: 0, scale: 1.02 },
    exit: { opacity: 0, x: -120, scale: 1.04 },
    transition: { duration: 1.9, ease: EASE },
  },
  {
    name: 'montee-douce',
    initial: { opacity: 0, y: 90, scale: 1.1 },
    animate: { opacity: 1, y: 0, scale: 1.02 },
    exit: { opacity: 0, y: -60, scale: 1.05 },
    transition: { duration: 1.9, ease: EASE },
  },
  {
    name: 'rideau-lateral',
    initial: { opacity: 0, clipPath: 'inset(0 100% 0 0)', scale: 1.05 },
    animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)', scale: 1.02 },
    exit: { opacity: 0, clipPath: 'inset(0 0 0 100%)' },
    transition: { duration: 2, ease: EASE },
  },
  {
    name: 'dissolution-floue',
    initial: { opacity: 0, filter: 'blur(24px)', scale: 1.1 },
    animate: { opacity: 1, filter: 'blur(0px)', scale: 1.02 },
    exit: { opacity: 0, filter: 'blur(16px)' },
    transition: { duration: 1.7, ease: EASE },
  },
];

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildUrl = (seed) => `https://picsum.photos/seed/${seed}/1800/1200`;

// Assigne une transition différente à chaque diapositive, en évitant
// qu'une transition se retrouve deux fois d'affilée.
const buildTransitionOrder = (count) => {
  const order = [];
  let pool = shuffle(TRANSITIONS);
  for (let i = 0; i < count; i += 1) {
    if (pool.length === 0) pool = shuffle(TRANSITIONS);
    if (order.length && pool[0] === order[order.length - 1]) {
      pool.push(pool.shift());
    }
    order.push(pool.shift());
  }
  return order;
};

const HeroSection = () => {
  const [slides] = useState(() => shuffle(SEED_POOL).slice(0, SLIDE_COUNT).map(buildUrl));
  const transitionOrder = useMemo(() => buildTransitionOrder(slides.length), [slides.length]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Précharge la prochaine image pour que le passage soit toujours net, jamais un flash.
  useEffect(() => {
    const next = new Image();
    next.src = slides[(index + 1) % slides.length];
  }, [index, slides]);

  const active = transitionOrder[index];

  return (
    <section id="accueil" className="relative h-screen w-full overflow-hidden bg-charcoal">
      {/* DIAPORAMA */}
      <AnimatePresence>
        <motion.img
          key={slides[index]}
          src={slides[index]}
          alt="Photographie artistique"
          initial={active.initial}
          animate={active.animate}
          exit={active.exit}
          transition={active.transition}
          style={{ willChange: 'transform, opacity, filter, clip-path' }}
          className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05]"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/10" />
      <div className="absolute inset-0 bg-sauge/10" />

      {/* CONTENU */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-32 text-center md:pb-40">
        <motion.span
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold/80"
        >
          Photographe — Portraits &amp; Instants
        </motion.span>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.05, duration: 1.1, ease: EASE }}
          className="mt-6 font-display text-5xl italic tracking-wide text-ivory md:text-8xl"
        >
          Nom Prénom
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 1, ease: EASE }}
          className="mt-6 max-w-md font-sans text-sm font-light tracking-wide text-ivory/70"
        >
          Une lumière, un regard, un instant suspendu. Basé à Fianarantsoa.
        </motion.p>
      </div>

      {/* INDICATEURS DE DIAPORAMA */}
      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-20">
        {slides.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            aria-label={`Aller à l'image ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-gold' : 'w-3 bg-ivory/30 hover:bg-ivory/50'
            }`}
          />
        ))}
      </div>

      {/* INDICATEUR DE SCROLL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-6 w-[1px] bg-gradient-to-b from-gold/80 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;