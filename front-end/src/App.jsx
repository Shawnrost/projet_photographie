import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// Importation de tes composants (assure-toi que les chemins sont corrects)
import Navbar from './components/shared/Navbar';
import Hero from './components/vitrine/Hero';
import Gallery from './components/vitrine/Gallery';
import Features from './components/vitrine/Features';
import Pricing from './components/vitrine/Pricing';

function App() {
  // Barre de progression de lecture (en haut de l'écran)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative bg-white selection:bg-sage-200 selection:text-sage-900">
      
      {/* Barre de progression d'animation maximale */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-sage-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <Navbar />

      <main>
        {/* 1. Hero Slider Cinématique avec Vert Sauge */}
        <section id="accueil">
          <Hero />
        </section>

        {/* 2. Section de transition textuelle artistique */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="py-20 text-center bg-white"
        >
          <h2 className="text-4xl md:text-6xl font-serif italic text-sage-900/20 select-none">
            Capturer l'invisible, exposer l'éternel.
          </h2>
        </motion.div>

        {/* 3. Galerie Organique & Z-Layout (Images Corrigées) */}
        <section id="galerie">
          <Gallery />
        </section>

        {/* 4. Caractéristiques de l'application (Denses & Animées) */}
        <section id="services">
          <Features />
        </section>

        {/* 5. Tarifs Minimalistes */}
        <section id="tarifs">
          <Pricing />
        </section>
      </main>

      {/* Footer Minimaliste */}
      <footer className="py-20 bg-sage-900 text-sage-100 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif italic mb-6">e-Sary</h2>
          <p className="text-sage-400 font-light tracking-widest text-xs uppercase mb-8">
            © 2026 Studio Photographique — Antananarivo
          </p>
          <div className="flex justify-center gap-8 text-sm font-light">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;