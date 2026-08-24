// src/components/abonnement/ModalConfirmation.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModalConfirmation = ({ 
  estOuvert, 
  onFermer, 
  titre, 
  message, 
  onConfirmer,
  theme 
}) => {
  if (!estOuvert) return null;

  return (
    <AnimatePresence>
      {estOuvert && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            onClick={onFermer}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.4
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1f2922] text-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-white/10 relative overflow-hidden">
              {/* Glow décoratif */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Icône d'avertissement */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 22, 
                  delay: 0.1 
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center"
              >
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>

              {/* Titre */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl sm:text-2xl font-serif italic text-center text-white mb-2"
              >
                {titre || 'Confirmation'}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-white/60 text-center leading-relaxed mb-6 px-2"
              >
                {message || 'Êtes-vous sûr de vouloir effectuer cette action ?'}
              </motion.p>

              {/* Séparateur */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"
              />

              {/* Boutons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onFermer}
                  className="flex-1 bg-white/5 border border-white/10 text-white/50 px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all order-2 sm:order-1"
                >
                  Annuler
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (onConfirmer) onConfirmer();
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-500/20 order-1 sm:order-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Confirmer
                  </span>
                </motion.button>
              </motion.div>

              {/* Bouton fermer (X) */}
              <button
                onClick={onFermer}
                className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalConfirmation;