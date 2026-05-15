import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EtapeRole from './EtapeRole';
import EtapeIdentite from './EtapeIdentite';
import EtapePhoto from './EtapePhoto'; // Importation de la nouvelle étape
import EtapeBio from './EtapeBio';
import EtapeSecurite from './EtapeSecurite';

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2000",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000"
];

const Inscription = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("client"); 
  const [tempRole, setTempRole] = useState(null); 
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((prev) => (prev + 1) % BG_IMAGES.length), 10000);
    return () => clearInterval(timer);
  }, []);

  const leftContent = {
    default: {
      title: "Le Choix",
      subtitle: "REJOIGNEZ LA GALERIE POUR GÉRER VOS ACQUISITIONS ET VOS TIRAGES CERTIFIÉS.",
      details: "Sélectionnez votre profil pour accéder à nos services exclusifs.",
      widgets: [{ val: "12k", label: "MEMBRES" }, { val: "450", label: "ARTISTES" }]
    },
    client: {
      title: step === 1 ? "Collectionneur" : step === 2 ? "L'Identité" : step === 3 ? "Le Portrait" : "Sécurité",
      subtitle: "UN ACCÈS PRIVILÉGIÉ AUX ŒUVRES LES PLUS RARES.",
      details: "Bénéficiez de certificats d'authenticité numériques et de ventes privées.",
      widgets: [{ val: "VIP", label: "PRIVILÈGE" }, { val: "24/7", label: "SUPPORT" }]
    },
    photographe: {
      title: step === 1 ? "Photographe" : step === 4 ? "Le Manifeste" : step === 3 ? "Le Portrait" : "L'Identité",
      subtitle: "EXPOSEZ VOTRE TALENT À UNE AUDIENCE INTERNATIONALE.",
      details: "Gérez vos séries limitées et profitez de notre infrastructure premium.",
      widgets: [{ val: "90%", label: "COMMISSION" }, { val: "ELITE", label: "VISIBILITÉ" }]
    }
  };

  const activeContent = leftContent[tempRole] || leftContent[role] || leftContent.default;

  return (
    <section className="relative w-screen h-screen bg-[#1a1a1a] overflow-hidden flex items-center justify-center font-sans">
      
      {/* --- BOUTON RETOUR CONNEXION --- */}
      <motion.button 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/connexion')}
        className="absolute top-12 left-12 z-50 group flex items-center gap-4 transition-all"
      >
        <div className="w-8 h-[1px] bg-[#c5a358] group-hover:w-12 transition-all duration-500" />
        <span className="text-[#f5f5f1]/40 group-hover:text-[#c5a358] text-[9px] tracking-[0.4em] uppercase transition-colors italic font-light">
            Déjà membre ? Se connecter
        </span>
      </motion.button>

      {/* Background avec Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={bgIndex} src={BG_IMAGES[bgIndex]} 
            initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1.05, opacity: 0.2 }}
            exit={{ scale: 1, opacity: 0 }} transition={{ duration: 4 }}
            className="w-full h-full object-cover" 
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a]/95 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1300px] px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        
        {/* --- CÔTÉ GAUCHE : TEXTE ET WIDGETS --- */}
        <div className="lg:col-span-7 hidden lg:block border-l border-[#c5a358]/20 pl-10">
          <motion.div key={step + (tempRole || role)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[#c5a358] font-mono text-[9px] tracking-[0.5em] uppercase block mb-4 italic">Étape 0{step}</span>
            <h2 className="text-[#f5f5f1] font-serif italic text-7xl xl:text-8xl leading-none tracking-tighter transition-all">
              {step === 1 ? activeContent.title : step === 2 ? "L'Identité" : step === 3 ? "Le Portrait" : step === 4 && role === "photographe" ? "Le Manifeste" : "La Sécurité"}
            </h2>
            <div className="mt-8 space-y-6 max-w-sm">
                <p className="text-[#f5f5f1]/60 text-[10px] leading-relaxed tracking-[0.2em] uppercase font-light">{activeContent.subtitle}</p>
                <p className="text-[#f5f5f1]/30 text-xs italic font-light leading-relaxed">"{activeContent.details}"</p>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-[#f5f5f1]/5">
                {activeContent.widgets.map((w, i) => (
                    <div key={i}>
                        <p className="text-[#c5a358] text-2xl font-serif italic">{w.val}</p>
                        <p className="text-[#f5f5f1]/20 text-[8px] tracking-[0.3em] uppercase mt-1">{w.label}</p>
                    </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* --- CÔTÉ DROIT : FORMULAIRE --- */}
        <div className="lg:col-span-5 w-full max-w-sm mx-auto">
          <div className="bg-[#f5f5f1]/[0.03] backdrop-blur-[60px] border border-[#f5f5f1]/10 rounded-[40px] p-10 md:p-12 shadow-2xl relative">
            <div className="mb-10 flex justify-between items-end">
                <div>
                  <h3 className="text-[#f5f5f1] font-serif italic text-3xl font-light">S'inscrire</h3>
                  <p className="text-[#c5a358]/50 font-mono text-[7px] tracking-[0.5em] uppercase mt-2">{tempRole || role}</p>
                </div>
                <span className="text-[#f5f5f1]/5 font-serif italic text-7xl select-none leading-none">0{step}</span>
            </div>

            <AnimatePresence mode="wait">
              {/* Étape 1 : Choix du Rôle */}
              {step === 1 && <EtapeRole key="s1" setRole={setRole} setTempRole={setTempRole} onNext={() => setStep(2)} />}
              
              {/* Étape 2 : Nom, Prénom, Email */}
              {step === 2 && <EtapeIdentite key="s2" onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              
              {/* Étape 3 : Photo de Profil (Nouveau) */}
              {step === 3 && <EtapePhoto key="s3" onNext={() => setStep(role === "photographe" ? 4 : 5)} onBack={() => setStep(2)} />}
              
              {/* Étape 4 : Bio (Uniquement Photographe) */}
              {step === 4 && <EtapeBio key="s4" onNext={() => setStep(5)} onBack={() => setStep(3)} />}
              
              {/* Étape 5 : Sécurité (Mot de passe) */}
              {step === 5 && <EtapeSecurite key="s5" onBack={() => setStep(role === "photographe" ? 4 : 3)} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inscription;
