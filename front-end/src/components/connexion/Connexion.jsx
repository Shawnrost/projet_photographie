import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=2000",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000"
];

const Connexion = ({ setUser }) => {
  const [focusInput, setFocusInput] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((prev) => (prev + 1) % BG_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/connexion/', {
        email: email,
        password: password
      });

      if (response.data && response.data.success) {
        
        const tokenData = response.data.data || response.data;
        const access = tokenData.access;
        const refresh = tokenData.refresh;
        
        if (access) localStorage.setItem('access_token', access);
        if (refresh) localStorage.setItem('refresh_token', refresh);

        // ConnexionView Django retourne : { success, data: { access, refresh, utilisateur: {...} } }
        // La clé est "utilisateur" — pas "user"
        const incomingUser = tokenData.utilisateur
          || response.data.utilisateur
          || tokenData.user
          || response.data.user
          || {};

        // Construction du profil avec les champs exacts du modèle Utilisateur Django
        const userProfile = {
          prenom: incomingUser.prenom || "",
          nom: incomingUser.nom || "",
          email: incomingUser.email || email,
          role: incomingUser.role || "user",
          photo_profil: incomingUser.photo_profil || null,
          id: incomingUser.id || null,
        };

        // Sauvegarde locale
        localStorage.setItem('user_profile', JSON.stringify(userProfile));

        // Mise à jour du state global dans App.jsx via le handler centralisé
        if (typeof setUser === 'function') {
          setUser(userProfile);
        }

        setShowSuccess(true);

        setTimeout(() => {
          navigate('/accueil');
        }, 2200);

      } else {
        setApiError("Structure de validation du serveur incorrecte.");
      }

    } catch (error) {
      console.error("Erreur de connexion:", error);
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || "Identifiants invalides ou introuvables.");
      } else {
        setApiError("Liaison avec le serveur Fine Art interrompue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-screen h-screen bg-charcoal overflow-hidden flex items-center justify-center font-sans">
      
      {/* ÉCRAN DE SUCCÈS OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-charcoal flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: [0, 0.15, 0.05] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute w-[500px] h-[500px] rounded-full border border-gold pointer-events-none"
            />

            <div className="text-center space-y-4 z-10 px-6">
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-ivory text-[9px] tracking-[0.5em] uppercase font-mono italic"
              >
                Signature vérifiée
              </motion.p>

              <motion.h1 
                initial={{ opacity: 0, filter: "blur(5px)", letterSpacing: "[-0.03em]" }}
                animate={{ opacity: 1, filter: "blur(0px)", letterSpacing: "[-0.01em]" }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                className="text-ivory font-display italic text-5xl md:text-6xl font-light leading-none"
              >
                Accès autorisé.
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "60px" }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-[1px] bg-gold mx-auto mt-6"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIAPORAMA D'ARRIÈRE-PLAN */}
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

      {/* WIDGETS DÉCORATIFS */}
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

      {/* GRILLE PRINCIPALE */}
      <div className="relative z-10 w-full max-w-[1300px] px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        
        {/* TEXTE ÉDITORIAL */}
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

        {/* FORMULAIRE */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="lg:col-span-5 w-full max-w-sm mx-auto"
        >
          <div className="bg-ivory/[0.03] backdrop-blur-[60px] border border-ivory/10 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            
            <div className="mb-12 flex justify-between items-start">
              <div>
                <h3 className="text-ivory font-display italic text-4xl font-light">Entrer</h3>
                <p className="text-gold/50 font-mono text-[7px] tracking-[0.5em] uppercase mt-2">Identification</p>
              </div>
              <span className="text-ivory/5 font-display italic text-7xl select-none leading-none">01</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-10">
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusInput('email')}
                  onBlur={() => setFocusInput(null)}
                  disabled={loading}
                  required
                  className="w-full bg-transparent border-b border-ivory/10 py-3 text-ivory text-xs focus:outline-none transition-all placeholder:text-ivory/10 tracking-wide"
                  placeholder="ID EMAIL"
                />
                <motion.div className="absolute bottom-0 left-0 h-[1px] bg-gold" animate={{ width: focusInput === 'email' ? '100%' : 0 }} />
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusInput('pw')}
                  onBlur={() => setFocusInput(null)}
                  disabled={loading}
                  required
                  className="w-full bg-transparent border-b border-ivory/10 py-3 text-ivory text-xs focus:outline-none transition-all placeholder:text-ivory/10 tracking-widest"
                  placeholder="CLEF D'ACCÈS"
                />
                <motion.div className="absolute bottom-0 left-0 h-[1px] bg-gold" animate={{ width: focusInput === 'pw' ? '100%' : 0 }} />
              </div>

              <AnimatePresence>
                {apiError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    className="text-[9px] text-red-400/90 font-mono uppercase tracking-widest text-center italic"
                  >
                    × {apiError}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className="group relative w-full py-4 rounded-xl bg-ivory text-charcoal shadow-xl transition-all duration-500 overflow-hidden disabled:opacity-40"
              >
                <span className="relative z-10 font-display italic text-lg tracking-wide">
                  {loading ? "Authentification..." : "Ouvrir la session"}
                </span>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              </motion.button>
            </form>

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