import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=2000",
    title: "L'Équilibre",
    sub: "COLLECTION PRINTEMPS 2026",
    stats: { views: "2.4k", likes: "842" },
    tech: { f: "f/2.8", shutter: "1/200s", body: "Sony A7R IV" }
  },
  {
    url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000",
    title: "Le Regard",
    sub: "PORTRAITS DES HAUTES TERRES",
    stats: { views: "1.8k", likes: "630" },
    tech: { f: "f/1.4", shutter: "1/500s", body: "Canon R5" }
  }
];

const Banniere = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % SLIDES.length), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-screen bg-charcoal overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={SLIDES[index].url} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none text-center">
        <motion.span 
          key={`sub-${index}`}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-gold tracking-[1em] text-[10px] md:text-xs mb-4 uppercase"
        >
          {SLIDES[index].sub}
        </motion.span>
        
        <div className="overflow-hidden">
          <motion.h1 
            key={`title-${index}`}
            initial={{ y: "100%" }} animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-ivory font-display italic text-[14vw] md:text-[14rem] leading-[0.85] drop-shadow-2xl"
          >
            {SLIDES[index].title}
          </motion.h1>
        </div>
      </div>

      {/* WIDGET GAUCHE */}
      <motion.div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-12 z-20 hidden lg:block" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <div>
          <p className="text-gold font-mono text-[9px] tracking-widest uppercase mb-1">Ouverture</p>
          <p className="text-ivory text-2xl font-light">{SLIDES[index].tech.f}</p>
        </div>
        <div>
          <p className="text-gold font-mono text-[9px] tracking-widest uppercase mb-1">Boîtier</p>
          <p className="text-ivory text-lg font-light w-32 leading-tight">{SLIDES[index].tech.body}</p>
        </div>
      </motion.div>

      {/* WIDGET DROITE */}
      <motion.div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-10 z-20" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <div className="text-right">
          <p className="text-ivory/40 font-mono text-[9px] mb-2 uppercase tracking-tighter">Engagement</p>
          <span className="text-ivory text-4xl font-display italic">{SLIDES[index].stats.views}</span>
        </div>
        <div className="flex flex-col gap-4">
          {['IG', 'TW', 'FB'].map((social) => (
            <div key={social} className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-[10px] text-ivory hover:bg-gold transition-all duration-500 cursor-pointer">{social}</div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Banniere;