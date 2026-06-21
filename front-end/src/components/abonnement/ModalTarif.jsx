// src/components/abonnement/ModalTarif.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModalTarif = ({ estOuvert, onFermer, onSoumettre, tarifExistant, estAdmin, theme }) => {
  const [formData, setFormData] = useState({
    plan: '',
    duree: '',
    prix: '',
    est_actif: true
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (tarifExistant) {
      setFormData({
        plan: tarifExistant.plan || '',
        duree: tarifExistant.duree || '',
        prix: tarifExistant.prix || '',
        est_actif: tarifExistant.est_actif !== undefined ? tarifExistant.est_actif : true
      });
    } else {
      setFormData({
        plan: '',
        duree: '',
        prix: '',
        est_actif: true
      });
    }
    setErreur(null);
  }, [tarifExistant, estOuvert]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);

    const planTrimmed = formData.plan.trim();
    const dureeTrimmed = formData.duree.trim();
    const prix = parseFloat(formData.prix);

    if (!planTrimmed) {
      setErreur('Le nom du plan est requis (ex: basic, premium)');
      return;
    }

    if (!dureeTrimmed) {
      setErreur('La durée est requise (ex: 1_mois, 3_mois, 6_mois)');
      return;
    }

    if (!formData.prix || isNaN(prix) || prix <= 0) {
      setErreur('Le prix doit être un nombre supérieur à 0');
      return;
    }

    const validPlans = ['basic', 'premium'];
    const validDurees = ['1_mois', '3_mois', '6_mois'];

    if (!validPlans.includes(planTrimmed.toLowerCase())) {
      setErreur('Le plan doit être "basic" ou "premium"');
      return;
    }

    if (!validDurees.includes(dureeTrimmed.toLowerCase())) {
      setErreur('La durée doit être "1_mois", "3_mois" ou "6_mois"');
      return;
    }

    const dataToSubmit = {
      plan: planTrimmed.toLowerCase(),
      duree: dureeTrimmed.toLowerCase(),
      prix: prix,
      est_actif: formData.est_actif
    };

    setChargement(true);

    try {
      if (tarifExistant) {
        await onSoumettre(tarifExistant.id, dataToSubmit);
      } else {
        await onSoumettre(dataToSubmit);
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors de l\'opération');
    } finally {
      setChargement(false);
    }
  };

  if (!estAdmin) return null;

  return (
    <AnimatePresence>
      {estOuvert && (
        <>
          {/* Overlay - fixed pour couvrir tout l'écran */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            onClick={onFermer}
          />

          {/* Modal - fixed au centre, ne bouge pas au scroll */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
            style={{
              // Force le centrage même en cas de scroll
              pointerEvents: 'none',
            }}
          >
            {/* Contenu du modal - avec pointer-events auto pour les interactions */}
            <div 
              className="bg-[#1f2922] text-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-white/10 relative"
              style={{
                pointerEvents: 'auto',
                margin: 'auto',
              }}
            >
              {/* Glow décoratif */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#aec3b0]/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Bouton fermer */}
              <button
                onClick={onFermer}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/30 hover:text-white/70 transition w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 flex items-center justify-center z-10"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* En-tête */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#aec3b0] to-transparent rounded-full flex-shrink-0" />
                  <h2 className="font-serif italic text-xl sm:text-2xl text-white">
                    {tarifExistant ? '✏️ Modifier le tarif' : '➕ Nouveau tarif'}
                  </h2>
                </div>
                <p className="text-white/30 text-[8px] sm:text-[9px] font-mono tracking-widest pl-4">
                  {tarifExistant ? 'Mettez à jour les informations' : 'Configurez une nouvelle formule'}
                </p>
              </div>

              {/* Erreur */}
              {erreur && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-[10px] sm:text-xs mb-5"
                >
                  ❌ {erreur}
                </motion.div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1.5 sm:mb-2">
                    Plan <span className="text-[#aec3b0]">*</span>
                  </label>
                  <input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    placeholder="Ex: basic, premium"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#aec3b0] focus:bg-white/10 transition-all placeholder-white/20"
                    required
                  />
                  <p className="text-[6px] sm:text-[7px] text-white/20 font-mono tracking-wider mt-1.5 pl-1">
                    Valeurs acceptées : basic, premium
                  </p>
                </div>

                <div>
                  <label className="block text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1.5 sm:mb-2">
                    Durée <span className="text-[#aec3b0]">*</span>
                  </label>
                  <input
                    type="text"
                    name="duree"
                    value={formData.duree}
                    onChange={handleChange}
                    placeholder="Ex: 1_mois, 3_mois, 6_mois"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#aec3b0] focus:bg-white/10 transition-all placeholder-white/20"
                    required
                  />
                  <p className="text-[6px] sm:text-[7px] text-white/20 font-mono tracking-wider mt-1.5 pl-1">
                    Valeurs acceptées : 1_mois, 3_mois, 6_mois
                  </p>
                </div>

                <div>
                  <label className="block text-[7px] sm:text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1.5 sm:mb-2">
                    Prix (MGA) <span className="text-[#aec3b0]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/20 font-mono text-[10px] sm:text-xs">Ar</span>
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      step="100"
                      min="0"
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#aec3b0] focus:bg-white/10 transition-all placeholder-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="est_actif"
                      checked={formData.est_actif}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-8 sm:w-10 h-4 sm:h-5 bg-white/10 rounded-full peer peer-checked:bg-[#aec3b0]/30 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 sm:after:h-4 after:w-3 sm:after:w-4 after:transition-all"></div>
                  </label>
                  <span className="text-[11px] sm:text-sm text-white/60">
                    Actif <span className="text-[7px] sm:text-[8px] text-white/30 font-mono ml-1">(visible pour les utilisateurs)</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onFermer}
                    className="flex-1 bg-white/5 border border-white/10 text-white/40 px-4 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm hover:bg-white/10 transition-all order-2 sm:order-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={chargement}
                    className="flex-1 bg-[#aec3b0] text-[#1f2922] px-4 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-[#c5d6c9] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#aec3b0]/20 order-1 sm:order-2"
                  >
                    {chargement ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-[#1f2922]/30 border-t-[#1f2922] animate-spin" />
                        En cours...
                      </span>
                    ) : (
                      tarifExistant ? 'Modifier' : 'Créer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalTarif;