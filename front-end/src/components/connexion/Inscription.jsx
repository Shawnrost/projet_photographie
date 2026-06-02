import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EtapeRole from './EtapeRole';
import EtapeIdentite from './EtapeIdentite';
import EtapePhoto from './EtapePhoto';
import EtapeSecurite from './EtapeSecurite';

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2000",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000"
];

const Inscription = () => {
  const [step, setStep] = useState(1);
  const [tempRole, setTempRole] = useState(null); 
  const [bgIndex, setBgIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // État pour l'écran de succès
  const [apiErrors, setApiErrors] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "client",
    prenom: "",
    nom: "",
    email: "",
    photo_profil: null,
    password: "",
    password_confirm: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((prev) => (prev + 1) % BG_IMAGES.length), 10000);
    return () => clearInterval(timer);
  }, []);

  const updateData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleFinalSubmit = async (passwordFields) => {
    setLoading(true);
    setApiErrors(null);

    const finalPayload = {
      ...formData,
      ...passwordFields
    };

    try {
      const response = await axios.post('http://localhost:8000/api/auth/inscription/', {
        email: finalPayload.email,
        nom: finalPayload.nom,
        prenom: finalPayload.prenom,
        role: finalPayload.role,
        password: finalPayload.password,
        password_confirm: finalPayload.password_confirm
      });

      if (response.data.success) {
        // Déclenche l'animation de succès stylée
        setShowSuccess(true);
        // Laisse l'animation s'exécuter pendant 3.5 secondes avant de rediriger
        setTimeout(() => {
          navigate('/connexion');
        }, 3500);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setApiErrors(error.response.data.errors || { message: error.response.data.message });
      } else {
        setApiErrors({ global: "Une erreur réseau est survenue." });
      }
    } finally {
      setLoading(false);
    }
  };

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
      title: step === 1 ? "Photographe" : step === 2 ? "L'Identité" : step === 3 ? "Le Portrait" : "Sécurité",
      subtitle: "EXPOSEZ VOTRE TALENT À UNE AUDIENCE INTERNATIONALE.",
      details: "Gérer vos séries limitées et profitez de notre infrastructure premium.",
      widgets: [{ val: "90%", label: "COMMISSION" }, { val: "ELITE", label: "VISIBILITÉ" }]
    }
  };

  const activeContent = leftContent[tempRole] || leftContent[formData.role] || leftContent.default;

  return (
    <section className="relative w-screen h-screen bg-[#1a1a1a] overflow-hidden flex items-center justify-center font-sans">
      
      {/* --- ÉCRAN DE SUCCÈS OVERLAY ULTRA STYLÉ --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Cercle doré minimaliste qui s'étend */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: [0, 0.15, 0.05] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] rounded-full border border-[#c5a358] pointer-events-none"
            />

            {/* Contenu textuel poétique */}
            <div className="text-center space-y-6 z-10 px-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.4, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-[#f5f5f1] text-[10px] tracking-[0.6em] uppercase font-mono italic"
              >
                Acquisition de profil réussie
              </motion.p>

              <motion.h1 
                initial={{ opacity: 0, letterSpacing: "[-0.05em]", filter: "blur(5px)" }}
                animate={{ opacity: 1, letterSpacing: "[-0.02em]", filter: "blur(0px)" }}
                transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                className="text-[#f5f5f1] font-serif italic text-6xl md:text-8xl font-light leading-none"
              >
                Bienvenue à la Galerie.
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 1.2, duration: 1 }}
                className="h-[1px] bg-[#c5a358] mx-auto mt-8"
              />

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="text-[#f5f5f1] text-[9px] tracking-[0.2em] uppercase font-light pt-4"
              >
                Préparation de votre espace personnel...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/connexion')}
        className="absolute top-12 left-12 z-40 group flex items-center gap-4 transition-all"
      >
        <div className="w-8 h-[1px] bg-[#c5a358] group-hover:w-12 transition-all duration-500" />
        <span className="text-[#f5f5f1]/40 group-hover:text-[#c5a358] text-[9px] tracking-[0.4em] uppercase transition-colors italic font-light">
            Déjà membre ? Se connecter
        </span>
      </motion.button>

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
        
        <div className="lg:col-span-7 hidden lg:block border-l border-[#c5a358]/20 pl-10">
          <motion.div key={step + (tempRole || formData.role)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[#c5a358] font-mono text-[9px] tracking-[0.5em] uppercase block mb-4 italic">Étape 0{step}</span>
            <h2 className="text-[#f5f5f1] font-serif italic text-7xl xl:text-8xl leading-none tracking-tighter transition-all">
              {step === 1 ? activeContent.title : step === 2 ? "L'Identité" : step === 3 ? "Le Portrait" : "La Sécurité"}
            </h2>
            <div className="mt-8 space-y-6 max-w-sm">
                <p className="text-[#f5f5f1]/60 text-[10px] leading-relaxed tracking-[0.2em] uppercase font-light">{activeContent.subtitle}</p>
                <p className="text-[#f5f5f1]/30 text-xs italic font-light leading-relaxed">"{activeContent.details}"</p>
            </div>
            
            {apiErrors && (
              <div className="mt-4 text-[10px] text-red-400 font-mono tracking-wide uppercase max-w-xs">
                {Object.entries(apiErrors).map(([key, val]) => (
                  <p key={key}>{key} : {Array.isArray(val) ? val[0] : val}</p>
                ))}
              </div>
            )}

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

        <div className="lg:col-span-5 w-full max-w-sm mx-auto">
          <div className="bg-[#f5f5f1]/[0.03] backdrop-blur-[60px] border border-[#f5f5f1]/10 rounded-[40px] p-10 md:p-12 shadow-2xl relative">
            <div className="mb-10 flex justify-between items-end">
                <div>
                  <h3 className="text-[#f5f5f1] font-serif italic text-3xl font-light">S'inscrire</h3>
                  <p className="text-[#c5a358]/50 font-mono text-[7px] tracking-[0.5em] uppercase mt-2">{tempRole || formData.role}</p>
                </div>
                <span className="text-[#f5f5f1]/5 font-serif italic text-7xl select-none leading-none">0{step}</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <EtapeRole 
                  key="s1" 
                  setRole={(r) => updateData({ role: r })} 
                  setTempRole={setTempRole} 
                  onNext={() => setStep(2)} 
                />
              )}
              
              {step === 2 && (
                <EtapeIdentite 
                  key="s2" 
                  currentData={formData}
                  onNext={(data) => { updateData(data); setStep(3); }} 
                  onBack={() => setStep(1)} 
                />
              )}
              
              {step === 3 && (
                <EtapePhoto 
                  key="s3" 
                  onNext={(file) => { updateData({ photo_profil: file }); setStep(4); }} 
                  onBack={() => setStep(2)} 
                />
              )}
              
              {step === 4 && (
                <EtapeSecurite 
                  key="s4" 
                  loading={loading}
                  onSubmit={handleFinalSubmit} 
                  onBack={() => setStep(3)} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inscription;