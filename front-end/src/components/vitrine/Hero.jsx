import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=2000",
    label: "01 — PORTFOLIO",
    title: ["CAPTUREZ", "L'INSTANT"],
    tagline: "La première plateforme malgache dédiée aux photographes professionnels.",
    accent: "#38bdf8",
    stats: [{ v: "12K+", l: "Photographes" }, { v: "80K+", l: "Œuvres" }, { v: "99%", l: "Satisfaction" }]
  },
  {
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000",
    label: "02 — MARKETPLACE",
    title: ["VENDEZ", "VOS RÊVES"],
    tagline: "Monétisez votre art. Zéro commission. Droits d'auteur garantis.",
    accent: "#f472b6",
    stats: [{ v: "0%", l: "Commission" }, { v: "25K Ar", l: "Abonnement/mois" }, { v: "∞", l: "Uploads" }]
  },
  {
    url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80&w=2000",
    label: "03 — COMMUNITY",
    title: ["CONNECTEZ", "VOS TALENTS"],
    tagline: "Chat instantané, missions, événements. Votre réseau en un seul endroit.",
    accent: "#34d399",
    stats: [{ v: "500+", l: "Missions/mois" }, { v: "Live", l: "Messagerie" }, { v: "Elite", l: "Communauté" }]
  }
];

const EASE = [0.25, 0.1, 0.25, 1];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 25, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 25, mass: 0.5 });

  const handleMouseMove = useCallback((e) => {
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 16);
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 10);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const DURATION = 7000;
    let start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(((now - start) / DURATION) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        setIndex(prev => (prev + 1) % slides.length);
        start = performance.now();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const slide = slides[index];

  return (
    <section
      className="relative h-screen bg-black overflow-hidden flex flex-col justify-end"
      onMouseMove={handleMouseMove}
      style={{ contain: 'layout style paint' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`bg-${index}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            style={{ x: springX, y: springY, willChange: 'transform' }}
            className="absolute inset-[-2%] w-[104%] h-[104%]"
          >
            <img src={slide.url} className="w-full h-full object-cover" alt="" loading="eager" decoding="async" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`num-${index}`}
          className="absolute top-28 right-8 text-[10rem] font-black text-white/[0.04] select-none leading-none pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ willChange: 'transform, opacity' }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>

      <div className="container mx-auto px-6 z-10 pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`label-${index}`}
            className="inline-block mb-5 font-mono text-[11px] tracking-[0.4em] uppercase px-3 py-1 rounded-full border"
            style={{ color: slide.accent, borderColor: `${slide.accent}50`, backgroundColor: `${slide.accent}12`, willChange: 'opacity' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {slide.label}
          </motion.span>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`title-${index}`}>
            {slide.title.map((word, wi) => (
              <div key={wi} className="overflow-hidden">
                <motion.h1
                  className="block text-[clamp(3.5rem,11vw,9rem)] font-black tracking-tighter leading-[0.9] text-white uppercase"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-105%' }}
                  transition={{ duration: 0.5, delay: wi * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform' }}
                >
                  {wi === 1
                    ? <span className="italic font-light" style={{ color: slide.accent }}>{word}</span>
                    : word}
                </motion.h1>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`tag-${index}`}
              className="text-white/50 max-w-sm text-base leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
            >
              {slide.tagline}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`stats-${index}`}
              className="flex gap-8 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
            >
              {slide.stats.map((s, si) => (
                <div key={si} className={si > 0 ? "border-l border-white/10 pl-8" : ""}>
                  <p className="text-3xl font-bold text-white">{s.v}</p>
                  <p className="text-white/30 text-xs tracking-widest uppercase mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex z-20 h-[3px]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setProgress(0); }}
            className="flex-1 bg-white/10 relative overflow-hidden"
          >
            {i === index && (
              <div className="absolute inset-y-0 left-0" style={{ width: `${progress}%`, backgroundColor: slide.accent }} />
            )}
            {i < index && <div className="absolute inset-0" style={{ backgroundColor: slide.accent }} />}
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none esary-bounce">
        <span className="text-white/25 font-mono text-[9px] tracking-[0.35em] uppercase">Défiler</span>
        <ChevronDown size={14} className="text-white/25" />
      </div>
    </section>
  );
};

export default Hero;
