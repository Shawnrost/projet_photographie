import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuArtiste = ({ user, initiales, onLogout, onClose }) => {
  const navigate = useNavigate();
  // État pour basculer vers l'écran de confirmation
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 top-full mt-3 w-64 bg-ivory border border-charcoal/10 rounded-[32px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pointer-events-auto"
    >
      {/* AFFICHAGE CONDITIONNEL ANIMÉ */}
      {!showConfirm ? (
        <motion.div
          key="main-menu"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col"
        >
          {/* En-tête du menu : Identité visuelle Ofélia */}
          <div className="flex items-center gap-4 pb-3 mb-2 border-b border-charcoal/5 select-none">
            <div className="w-10 h-10 rounded-full border border-gold/30 overflow-hidden shrink-0 bg-charcoal/5 flex items-center justify-center">
              {user?.photo_profil ? (
                <img src={user.photo_profil} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif italic text-gold text-sm font-light tracking-normal">{initiales}</span>
              )}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-[7.5px] font-mono text-gold tracking-[0.3em] uppercase mb-0.5 opacity-80">Session</p>
              <p className="font-serif italic text-lg text-charcoal leading-tight truncate">{user?.prenom || 'Ofélia'}</p>
            </div>
          </div>
          
          {/* Bouton Mon Profil */}
          <button 
            onClick={() => {
              if (onClose) onClose();
              navigate('/profil');
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 text-[10px] font-sans tracking-[0.25em] uppercase transition-all flex items-center gap-3 group"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-gold/60 group-hover:bg-gold transition-colors" /> 
             <span>Mon Profil</span>
          </button>

          {/* Bouton Paramètres */}
          <button className="w-full text-left px-4 py-3 rounded-2xl text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 text-[10px] font-sans tracking-[0.25em] uppercase transition-all flex items-center gap-3 group">
             <div className="w-1.5 h-1.5 rounded-full bg-gold/60 group-hover:bg-gold transition-colors" /> 
             <span>Paramètres</span>
          </button>
          
          {/* Déclencheur de la confirmation */}
          <button 
            onClick={() => setShowConfirm(true)}
            className="w-full text-left px-4 py-3 mt-1 rounded-2xl bg-red-500/[0.03] text-red-500 text-[10px] font-sans tracking-[0.25em] uppercase transition-all flex items-center gap-3 italic group hover:bg-red-500/[0.07]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> 
            <span>Déconnexion</span>
          </button>
        </motion.div>
      ) : (
        /* ÉCRAN DE CONFIRMATION PREMIUM */
        <motion.div
          key="confirm-menu"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col text-center py-2 select-none"
        >
          <p className="text-[8px] font-mono text-gold tracking-[0.3em] uppercase mb-1">Attention</p>
          <p className="font-serif italic text-base text-charcoal/80 mb-5 leading-snug">
            Quitter la galerie numérique ?
          </p>

          <div className="flex flex-col gap-2">
            {/* Bouton pour valider la déconnexion */}
            <button 
              onClick={() => {
                if (onClose) onClose();
                if (onLogout) onLogout();
              }}
              className="w-full py-3 rounded-2xl bg-red-500 text-white text-[9px] font-mono tracking-[0.2em] uppercase font-medium transition-all shadow-sm hover:bg-red-600 active:scale-[0.98]"
            >
              Oui, me déconnecter
            </button>

            {/* Bouton pour annuler et revenir en arrière */}
            <button 
              onClick={() => setShowConfirm(false)}
              className="w-full py-3 rounded-2xl border border-charcoal/10 text-charcoal/60 text-[9px] font-mono tracking-[0.2em] uppercase transition-all hover:bg-charcoal/[0.03] hover:text-charcoal"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MenuArtiste;