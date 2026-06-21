// src/components/abonnement/CarteAbonne.jsx

import React from 'react';
import { motion } from 'framer-motion';

const CarteAbonne = ({ abonne, theme }) => {
  // Fonction pour obtenir la couleur du plan
  const getPlanColor = (plan) => {
    const planLower = plan?.toLowerCase() || '';
    if (planLower === 'premium') return 'from-amber-500/20 to-amber-500/5 border-amber-500/20';
    if (planLower === 'pro') return 'from-blue-500/20 to-blue-500/5 border-blue-500/20';
    if (planLower === 'standard' || planLower === 'basic') return 'from-white/10 to-white/5 border-white/5';
    return 'from-white/10 to-white/5 border-white/5';
  };

  // Fonction pour obtenir le badge du statut
  const getStatutBadge = (statut) => {
    const statutLower = statut?.toLowerCase() || '';
    if (statutLower === 'actif' || statutLower === 'active') {
      return { 
        text: 'Actif', 
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
        dotColor: 'bg-emerald-400'
      };
    }
    if (statutLower === 'expire' || statutLower === 'expiré' || statutLower === 'expired') {
      return { 
        text: 'Expiré', 
        className: 'bg-red-500/20 text-red-400 border-red-500/20',
        dotColor: 'bg-red-400'
      };
    }
    if (statutLower === 'annule' || statutLower === 'annulé' || statutLower === 'cancelled') {
      return { 
        text: 'Annulé', 
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        dotColor: 'bg-yellow-400'
      };
    }
    return { 
      text: statut || 'Inconnu', 
      className: 'bg-white/10 text-white/60 border-white/5',
      dotColor: 'bg-white/30'
    };
  };

  // Formater la date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const planColor = getPlanColor(abonne.typePlan || abonne.plan);
  const statutBadge = getStatutBadge(abonne.statut || abonne.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-gradient-to-br ${planColor} backdrop-blur-sm border rounded-2xl overflow-hidden p-4 sm:p-5 hover:scale-[1.02] hover:border-white/20 transition-all duration-500 hover:shadow-2xl`}
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* En-tête */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statutBadge.dotColor} shadow-lg shadow-${statutBadge.dotColor}/30`} />
          <span className={`font-mono text-[6px] sm:text-[7px] font-medium tracking-widest uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${statutBadge.className}`}>
            {statutBadge.text}
          </span>
        </div>
        <span className={`font-mono text-[6px] sm:text-[7px] tracking-widest uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/10 text-white/60 border border-white/5`}>
          {abonne.typePlan || abonne.plan || 'Standard'}
        </span>
      </div>

      {/* Infos utilisateur */}
      <div className="flex-1">
        <h3 className="font-serif text-base sm:text-lg text-white leading-tight group-hover:text-[#aec3b0] transition-colors duration-300 truncate">
          {abonne.nom || abonne.username || 'Utilisateur'}
        </h3>
        <p className="font-sans text-[9px] sm:text-[10px] text-white/30 tracking-wide mt-1 truncate">
          {abonne.email || 'Email non disponible'}
        </p>
      </div>

      {/* Pied */}
      <div className="flex justify-between items-end pt-3 sm:pt-4 mt-3 border-t border-white/5">
        <div>
          <span className="font-mono text-[5px] sm:text-[6px] tracking-widest text-white/30 uppercase block">Échéance</span>
          <span className="font-sans text-[10px] sm:text-[11px] text-white/60 font-medium mt-0.5 block">
            {formatDate(abonne.dateFin || abonne.date_fin)}
          </span>
        </div>

        <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 group-hover:border-[#aec3b0]/30 group-hover:shadow-lg">
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40 group-hover:text-[#aec3b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default CarteAbonne;