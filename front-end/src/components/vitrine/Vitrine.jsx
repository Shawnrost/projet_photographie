import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Données minimales pour tester
const SLIDES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=2000",
    title: "L'Équilibre",
    sub: "COLLECTION PRINTEMPS 2026",
    category: "Portrait",
    stats: { views: "2.4k", likes: "842" },
    tech: { f: "f/2.8", shutter: "1/200s", body: "Sony A7R IV", iso: "100" },
    location: "Imerina, Madagascar",
    artist: "Mialisoa R."
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000",
    title: "Le Regard",
    sub: "PORTRAITS DES HAUTES TERRES",
    category: "Portrait",
    stats: { views: "1.8k", likes: "630" },
    tech: { f: "f/1.4", shutter: "1/500s", body: "Canon R5", iso: "200" },
    location: "Andringitra, Madagascar",
    artist: "Mialisoa R."
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000",
    title: "Évanescence",
    sub: "COLLECTION NOIR & BLANC",
    category: "Art",
    stats: { views: "3.1k", likes: "1.2k" },
    tech: { f: "f/2.0", shutter: "1/1000s", body: "Fujifilm GFX100S", iso: "400" },
    location: "Nosy Be, Madagascar",
    artist: "Mialisoa R."
  }
];

const Vitrine = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-charcoal min-h-screen">
      {/* BANNIÈRE */}
      <section className="relative h-screen w-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img 
              src={SLIDES[currentSlide].url} 
              className="w-full h-full object-cover" 
              alt={SLIDES[currentSlide].title}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          </motion.div>
        </AnimatePresence>

        {/* Contenu */}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none text-center px-4">
          <motion.span
            key={`sub-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-gold tracking-[0.8em] text-[10px] md:text-xs mb-6 uppercase"
          >
            {SLIDES[currentSlide].sub}
          </motion.span>
          
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-ivory font-display italic text-[12vw] md:text-[12rem] leading-[0.85] drop-shadow-2xl"
          >
            {SLIDES[currentSlide].title}
          </motion.h1>
        </div>

        {/* Indicateurs */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-[2px] transition-all duration-700 ${
                i === currentSlide ? 'w-8 bg-gold' : 'w-6 bg-ivory/20 hover:bg-ivory/40'
              }`}
            />
          ))}
        </div>

        {/* Texte en bas */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 text-center">
          <p className="text-ivory/40 font-mono text-[8px] tracking-[0.4em] uppercase">
            {SLIDES[currentSlide].artist} • {SLIDES[currentSlide].location}
          </p>
        </div>
      </section>

      {/* Section Galerie simplifiée */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-ivory font-display italic text-5xl md:text-7xl text-center mb-12">
            La Galerie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SLIDES.map((img) => (
              <div key={img.id} className="rounded-2xl overflow-hidden">
                <img src={img.url} alt={img.title} className="w-full h-80 object-cover" />
                <div className="p-4 bg-sauge/10">
                  <h3 className="text-ivory font-display italic text-xl">{img.title}</h3>
                  <p className="text-ivory/60 text-sm">{img.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-ivory/5">
        <div className="max-w-7xl mx-auto text-center">
          <span className="font-display text-2xl text-ivory">e<span className="text-gold">.</span>Sary</span>
          <p className="text-ivory/30 font-mono text-[7px] tracking-[0.5em] uppercase mt-2">
            Antananarivo • Madagascar • © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Vitrine;