// src/components/abonnement/CarteTarif.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CarteTarif = ({ 
  offre, 
  estActif, 
  estAuthentifie, 
  estAdmin,
  onSouscrire,
  onModifier,
  onSupprimer,
  theme
}) => {
  const estPremium = offre.plan === 'premium';
  const [menuOuvert, setMenuOuvert] = useState(false);

  const handleClick = () => {
    if (estAdmin) return;
    if (onSouscrire && estAuthentifie && !estActif) {
      onSouscrire();
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOuvert(!menuOuvert);
  };

  // Obtenir le label de la durée
  const getDureeLabel = (duree) => {
    const labels = {
      '1_mois': '1 mois',
      '3_mois': '3 mois',
      '6_mois': '6 mois'
    };
    return labels[duree] || duree;
  };

  const dureeLabel = offre.duree_label || getDureeLabel(offre.duree);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        estPremium
          ? 'bg-gradient-to-br from-amber-500/15 via-transparent to-amber-500/5 border border-amber-500/20 hover:border-amber-500/40'
          : 'bg-white/5 border border-white/5 hover:border-white/20'
      } ${estActif && !estAdmin ? 'opacity-40' : ''}`}
      onClick={handleClick}
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* Badge Premium */}
      {estPremium && (
        <div className="absolute top-0 right-0">
          <div className="bg-amber-500/20 text-amber-400 text-[6px] font-mono uppercase tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-bl-xl border-l border-b border-amber-500/20 backdrop-blur-sm">
            ★ Premium
          </div>
        </div>
      )}

      {/* Contenu - avec hauteur suffisante pour afficher le prix */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col h-full min-h-[150px] sm:min-h-[170px] md:min-h-[200px]">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="min-w-0 flex-1">
            <h3 className={`font-serif text-sm sm:text-base md:text-lg text-white truncate ${estPremium ? 'text-amber-400' : ''}`}>
              {offre.plan_label || offre.plan}
            </h3>
            <span className="text-white/30 text-[6px] sm:text-[7px] md:text-[8px] font-mono uppercase tracking-wider">
              {dureeLabel}
            </span>
          </div>
          
          {estAdmin && offre.est_actif !== undefined && (
            <span className={`text-[5px] sm:text-[6px] font-mono uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ml-1 sm:ml-2 ${
              offre.est_actif 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {offre.est_actif ? 'Actif' : 'Inactif'}
            </span>
          )}
        </div>

        {/* Séparateur décoratif */}
        <div className={`h-px w-8 sm:w-12 transition-all duration-500 group-hover:w-12 sm:group-hover:w-20 ${
          estPremium ? 'bg-amber-500/30' : 'bg-white/10'
        }`} />

        {/* Prix - toujours visible */}
        <div className="flex-1 flex items-end justify-between mt-3 sm:mt-4 md:mt-5">
          <div>
            <span className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-light tracking-tight">
              {Number(offre.prix).toLocaleString('fr-FR')}
            </span>
            <span className="text-white/20 text-[6px] sm:text-[7px] font-mono ml-0.5 sm:ml-1">MGA</span>
          </div>

          {!estAdmin && (
            <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
              estActif || !estAuthentifie 
                ? 'opacity-30 border-white/10' 
                : 'opacity-0 group-hover:opacity-100 border-[#aec3b0] group-hover:shadow-lg group-hover:shadow-[#aec3b0]/20'
            }`}>
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-[#aec3b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Menu admin */}
      {estAdmin && (
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-10">
          <button
            onClick={toggleMenu}
            className="text-white/30 hover:text-white/70 transition p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          <AnimatePresence>
            {menuOuvert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 mt-1 bg-[#1f2922] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[100px] sm:min-w-[120px] md:min-w-[140px] backdrop-blur-sm"
              >
                <button
                  onClick={() => {
                    setMenuOuvert(false);
                    if (onModifier) onModifier();
                  }}
                  className="block w-full text-left px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-[10px] md:text-xs text-white/70 hover:bg-white/10 hover:text-white transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setMenuOuvert(false);
                    if (onSupprimer) onSupprimer();
                  }}
                  className="block w-full text-left px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-[10px] md:text-xs text-red-400 hover:bg-red-500/10 transition"
                >
                  Supprimer
                </button>
                {!estActif && estAuthentifie && (
                  <button
                    onClick={() => {
                      setMenuOuvert(false);
                      if (onSouscrire) onSouscrire();
                    }}
                    className="block w-full text-left px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-[10px] md:text-xs text-emerald-400 hover:bg-emerald-500/10 transition border-t border-white/5"
                  >
                    Souscrire
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Overlay pour état inactif */}
      {estActif && !estAdmin && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
          <span className="text-white/60 text-[6px] sm:text-[7px] md:text-[8px] font-mono uppercase tracking-widest bg-black/30 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border border-white/10">
            Actif
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CarteTarif;