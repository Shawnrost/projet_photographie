import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Panier from './Panier';
import Historique from './Historique';
import api from '../../../services/api';

const CONFIG_THEME = {
  bg: '#2d3a30',
  bgCard: '#38483c',
  bgDeep: '#1f2922',
  accentSage: '#aec3b0',
  ivory: '#f8f9f8'
};

const Commande = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorConnexion, setErrorConnexion] = useState(false);
  const [activeTab, setActiveTab] = useState('panier');
  const [roleError, setRoleError] = useState(false);

  /* ── Authentification ── */
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/connexion'); return; }
    
    api.get('/auth/moi/')
      .then(r => { 
        if (r.data.success) {
          const userData = r.data.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          if (userData.role === 'photographe' || userData.role === 'admin') {
            setRoleError(true);
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }
        } else throw new Error(); 
      })
      .catch(() => {
        setErrorConnexion(true);
        setTimeout(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          navigate('/connexion');
        }, 2000);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <div style={{ backgroundColor: CONFIG_THEME.bg }}
      className="w-screen h-screen flex flex-col items-center justify-center font-sans text-xs tracking-[0.5em] text-[#f8f9f8]"
    >
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        style={{ color: CONFIG_THEME.accentSage }}
        className="text-3xl mb-4 font-serif italic"
      >
        Gasy Ant'sary
      </motion.div>
      CHARGEMENT DE VOTRE ESPACE...
    </div>
  );

  if (errorConnexion) return (
    <div style={{ backgroundColor: CONFIG_THEME.bg }}
      className="w-screen h-screen flex flex-col items-center justify-center font-sans text-center px-4"
    >
      <p className="text-red-300 text-xs tracking-[0.3em] uppercase mb-2 animate-pulse">Session expirée ou invalide</p>
      <p className="text-[#f8f9f8]/40 text-[10px] italic">Redirection vers l'espace de connexion...</p>
    </div>
  );

  if (roleError) return (
    <div style={{ backgroundColor: CONFIG_THEME.bg }}
      className="w-screen h-screen flex flex-col items-center justify-center font-sans text-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md"
      >
        <span className="text-4xl mb-4 block">🔒</span>
        <p className="text-white/80 text-sm font-light mb-2">
          Cette page est réservée aux clients.
        </p>
        <p className="text-white/40 text-xs font-mono tracking-wider">
          Vous serez redirigé dans quelques secondes...
        </p>
      </motion.div>
    </div>
  );

  return (
    <section className="w-screen h-screen bg-[#2d3a30] text-[#2d3a30] font-sans overflow-hidden flex flex-col md:flex-row relative">
      {/* Panneau gauche - Style comme recherche */}
      <div className="w-full md:w-5/12 h-2/5 md:h-full p-8 md:p-16 pt-32 md:pt-44 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10 bg-[#2d3a30]">
        <div className="space-y-8 md:space-y-12 my-auto w-full max-w-md mx-auto md:mx-0">
          
          {/* EN-TÊTE TYPOGRAPHIQUE */}
          <div className="space-y-2 select-none">
            <span className="font-mono text-[9px] tracking-[0.5em] text-[#aec3b0] uppercase italic block opacity-80">
              Espace Client
            </span>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white tracking-wide leading-none font-light">
              Mes Commandes<span className="text-[#aec3b0]">.</span>
            </h1>
          </div>

          {/* Tabs de navigation */}
          <div className="space-y-4">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#aec3b0]/60 select-none">
              Accéder à
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setActiveTab('panier')}
                className={`px-6 py-3.5 rounded-2xl font-mono text-[9px] tracking-widest uppercase transition-all duration-500 ease-out border text-left flex items-center gap-3 ${
                  activeTab === 'panier'
                    ? 'bg-[#aec3b0] text-[#2d3a30] border-[#aec3b0] font-semibold shadow-[0_10px_25px_rgba(174,195,176,0.15)] scale-[1.02]'
                    : 'bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <span className="text-lg">🛒</span>
                Panier
              </button>
              <button
                onClick={() => setActiveTab('historique')}
                className={`px-6 py-3.5 rounded-2xl font-mono text-[9px] tracking-widest uppercase transition-all duration-500 ease-out border text-left flex items-center gap-3 ${
                  activeTab === 'historique'
                    ? 'bg-[#aec3b0] text-[#2d3a30] border-[#aec3b0] font-semibold shadow-[0_10px_25px_rgba(174,195,176,0.15)] scale-[1.02]'
                    : 'bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <span className="text-lg">📜</span>
                Historique
              </button>
            </div>
          </div>

          {/* Indicateur d'état */}
          <div className="bg-[#aec3b0]/5 border border-[#aec3b0]/10 rounded-2xl p-4">
            <p className="font-mono text-[10px] text-[#aec3b0]/70 uppercase tracking-wider">
              {activeTab === 'panier' ? 'Panier actif' : 'Historique des commandes'}
            </p>
            <p className="font-serif italic text-sm text-[#aec3b0]/50 mt-1">
              {activeTab === 'panier' 
                ? 'Gérez vos articles en attente d\'achat' 
                : 'Retrouvez toutes vos acquisitions'}
            </p>
          </div>
        </div>

        {/* FOOTER DISCRET */}
        <p className="hidden md:block font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] select-none">
          Gasy Ant'sary Galerie — Espace Client
        </p>
      </div>

      {/* Panneau droit - Style comme résultats */}
      <div className="w-full md:w-3/5 h-3/5 md:h-full bg-[#f8f9f8] p-6 md:p-12 pt-16 md:pt-24 overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'panier' ? (
            <motion.div
              key="panier"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Panier theme={CONFIG_THEME} />
            </motion.div>
          ) : (
            <motion.div
              key="historique"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Historique theme={CONFIG_THEME} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Commande;