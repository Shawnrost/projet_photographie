import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=2000",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000"
];

const Connexion = () => {
  const [focusInput, setFocusInput] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((prev) => (prev + 1) % BG_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-screen h-screen bg-charcoal overflow-hidden flex items-center justify-center font-sans">
      
      {/* 1. DIAPORAMA D'ARRIÈRE-PLAN */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={bgIndex}
            src={BG_IMAGES[bgIndex]} 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.25 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-full h-full object-cover" 
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal/90 to-transparent" />
      </div>

      {/* 2. WIDGETS DÉCORATIFS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 30, opacity: 1 }}
          className="absolute right-8 top-8 flex items-center gap-3 bg-ivory/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-ivory/10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold font-mono text-[8px] tracking-[0.3em] uppercase">Node : MG-FIANAR</span>
        </motion.div>

        <motion.div 
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="absolute left-8 bottom-8"
        >
          <div className="bg-ivory/5 backdrop-blur-xl p-5 rounded-2xl border border-ivory/10 max-w-[200px]">
            <p className="text-ivory/40 text-[9px] leading-relaxed italic font-light uppercase tracking-widest">
              "Figer l'éternité."
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. GRILLE PRINCIPALE */}
      <div className="relative z-10 w-full max-w-[1300px] px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        
        {/* TEXTE ÉDITORIAL (Grisé/Sauge pour la douceur) */}
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="lg:col-span-7 hidden lg:block"
        >
          <div className="space-y-10">
            <div className="border-l border-gold/30 pl-8">
              <span className="text-gold font-mono text-[9px] tracking-[0.6em] uppercase block mb-4 opacity-70">Fine Art Studio</span>
              <h2 className="text-ivory font-display italic text-8xl xl:text-9xl font-light leading-[0.8] tracking-tighter">
                L'oeil du <br />
                <span className="text-sauge-mid not-italic font-sans font-light opacity-80">Créateur.</span>
              </h2>
            </div>
            
            <div className="flex gap-16 pt-8 ml-8">
              <div className="max-w-[180px]">
                <h4 className="text-gold font-display italic text-xl mb-2">Galerie</h4>
                <p className="text-ivory/30 text-[9px] tracking-[0.2em] uppercase leading-relaxed">Accès sécurisé aux tirages numérotés.</p>
              </div>
              <div className="max-w-[180px]">
                <h4 className="text-gold font-display italic text-xl mb-2">Studio</h4>
                <p className="text-ivory/30 text-[9px] tracking-[0.2em] uppercase leading-relaxed">Métadonnées et archives techniques.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. FORMULAIRE : VERSION PLUS PETITE (max-w-sm) */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="lg:col-span-5 w-full max-w-sm mx-auto" // CHANGEMENT : max-w-sm pour un div plus fin
        >
          <div className="bg-ivory/[0.03] backdrop-blur-[60px] border border-ivory/10 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            
            <div className="mb-12 flex justify-between items-start">
              <div>
                <h3 className="text-ivory font-display italic text-4xl font-light">Entrer</h3>
                <p className="text-gold/50 font-mono text-[7px] tracking-[0.5em] uppercase mt-2">Identification</p>
              </div>
              <span className="text-ivory/5 font-display italic text-7xl select-none leading-none">01</span>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
              <div className="relative group">
                <input 
                  type="email" 
                  onFocus={() => setFocusInput('email')}
                  onBlur={() => setFocusInput(null)}
                  className="w-full bg-transparent border-b border-ivory/10 py-3 text-ivory text-xs focus:outline-none transition-all placeholder:text-ivory/10"
                  placeholder="ID EMAIL"
                />
                <motion.div className="absolute bottom-0 left-0 h-[1px] bg-gold" animate={{ width: focusInput === 'email' ? '100%' : 0 }} />
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  onFocus={() => setFocusInput('pw')}
                  onBlur={() => setFocusInput(null)}
                  className="w-full bg-transparent border-b border-ivory/10 py-3 text-ivory text-xs focus:outline-none transition-all placeholder:text-ivory/10"
                  placeholder="CLEF D'ACCÈS"
                />
                <motion.div className="absolute bottom-0 left-0 h-[1px] bg-gold" animate={{ width: focusInput === 'pw' ? '100%' : 0 }} />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="group relative w-full py-4 rounded-xl bg-ivory text-charcoal shadow-xl transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 font-display italic text-lg tracking-wide">
                  Ouvrir la session
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              </motion.button>
            </form>

            {/* ZONE BAS DE CARTE ÉPURÉE */}
            <div className="mt-16 flex flex-col items-center gap-8">
              <button 
                onClick={() => navigate('/inscription')}
                className="group flex flex-col items-center gap-2"
              >
                <span className="text-ivory/20 text-[8px] tracking-[0.5em] uppercase">Nouveau ?</span>
                <span className="text-gold/80 font-light text-[10px] tracking-[0.2em] uppercase border-b border-gold/10 pb-1 group-hover:border-gold transition-all">
                  Créer un compte
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOUTON RETOUR */}
      <motion.button 
        onClick={() => navigate('/')}
        className="fixed top-12 left-12 text-ivory/10 font-mono text-[8px] tracking-[0.4em] uppercase hover:text-gold transition-all z-50 flex items-center gap-4 group"
      >
        <div className="w-8 h-[1px] bg-ivory/10 group-hover:bg-gold" /> Retour
      </motion.button>
    </section>
  );
};

export default Connexion;