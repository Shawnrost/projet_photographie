// src/components/abonnement/ListeAbonnes.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarteAbonne from './CarteAbonne';

const ListeAbonnes = ({ abonnes, rechercheActive, theme }) => {
  if (!rechercheActive) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 md:py-32">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 sm:mb-5 border border-white/5">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>
        <p className="font-serif italic text-white/40 text-base sm:text-lg">
          Commencez à explorer
        </p>
        <div className="h-px w-8 sm:w-12 bg-white/10 mt-3" />
        <p className="text-white/20 text-[8px] sm:text-[9px] font-mono tracking-widest mt-2 sm:mt-3">
          Utilisez la recherche pour trouver des abonnés
        </p>
      </div>
    );
  }

  if (abonnes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 md:py-32">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 sm:mb-4 border border-white/5">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="font-serif italic text-white/40 text-base sm:text-lg">Aucun résultat</p>
        <p className="text-white/20 text-[8px] sm:text-[9px] font-mono tracking-widest mt-2">
          Essayez un autre terme de recherche
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      layout 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-8"
    >
      <AnimatePresence mode="popLayout">
        {abonnes.map((abonne, index) => (
          <CarteAbonne 
            key={abonne.id || index} 
            abonne={abonne} 
            theme={theme} 
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ListeAbonnes;