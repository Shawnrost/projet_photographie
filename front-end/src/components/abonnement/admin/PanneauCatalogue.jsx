// src/components/abonnement/PanneauCatalogue.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarteTarif from './CarteTarif';

const PanneauCatalogue = ({ 
  tarifs, 
  chargement, 
  recherche, 
  onChangementRecherche,
  statutAbonnement,
  onSouscrire,
  onAnnuler,
  onModifierTarif,
  onSupprimerTarif,
  onAjouterTarif,
  estAuthentifie,
  estAdmin,
  theme
}) => {
  const [filtrePlan, setFiltrePlan] = useState('tous');

  const handleSouscrire = (type, duree) => {
    if (onSouscrire && estAuthentifie) {
      onSouscrire(type, duree);
    }
  };

  const handleAnnuler = () => {
    if (onAnnuler && statutAbonnement?.abonnement?.id) {
      onAnnuler(statutAbonnement.abonnement.id);
    }
  };

  const aAbonnementActif = statutAbonnement?.a_abonnement_actif || false;
  const abonnementActuel = statutAbonnement?.abonnement || null;

  const tarifsFiltres = tarifs.filter(t => 
    filtrePlan === 'tous' || t.plan === filtrePlan
  );

  // Organiser les tarifs par plan pour un affichage plus artistique
  const tarifsBasic = tarifsFiltres.filter(t => t.plan === 'basic');
  const tarifsPremium = tarifsFiltres.filter(t => t.plan === 'premium');

  // Fonction pour obtenir le label de durée
  const getDureeLabel = (duree) => {
    const labels = {
      '1_mois': '1 mois',
      '3_mois': '3 mois',
      '6_mois': '6 mois'
    };
    return labels[duree] || duree;
  };

  return (
    <div className="w-full pb-8">
      {/* Barre de filtres et recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
            {['tous', 'basic', 'premium'].map((plan) => (
              <button
                key={plan}
                onClick={() => setFiltrePlan(plan)}
                className={`px-2.5 sm:px-4 md:px-5 py-1.5 rounded-xl text-[7px] sm:text-[8px] md:text-[9px] font-mono uppercase tracking-wider transition-all duration-300 ${
                  filtrePlan === plan
                    ? 'bg-[#aec3b0] text-[#1f2922] shadow-lg shadow-[#aec3b0]/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {plan === 'tous' ? 'Tous' : plan}
              </button>
            ))}
          </div>

          <span className="text-white/30 text-[7px] sm:text-[8px] font-mono tracking-widest">
            {tarifsFiltres.length} formules
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-none">
            <input 
              type="text"
              value={recherche}
              onChange={(e) => onChangementRecherche(e.target.value)}
              placeholder="Rechercher un abonné..."
              className="w-full sm:w-40 md:w-48 lg:w-56 bg-white/5 border border-white/10 focus:border-[#aec3b0] focus:bg-white/10 text-white rounded-xl pl-8 pr-3 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wide transition-all outline-none placeholder-white/20"
            />
            <svg className="w-3 h-3 text-white/20 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
            {recherche && (
              <button
                onClick={() => onChangementRecherche('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {estAdmin && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAjouterTarif}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-xl text-[7px] sm:text-[8px] md:text-[9px] font-mono uppercase tracking-widest transition border border-emerald-500/20 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-500/10 whitespace-nowrap"
            >
              <span className="text-sm sm:text-base leading-none">+</span> Ajouter
            </motion.button>
          )}
        </div>
      </div>

      {/* Abonnement actif */}
      <AnimatePresence>
        {aAbonnementActif && abonnementActuel && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 md:mb-6 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-[11px] sm:text-sm">
                      Abonnement actif
                    </h3>
                    <p className="text-[#aec3b0] text-[9px] sm:text-xs font-mono tracking-wide">
                      {abonnementActuel.type} · {abonnementActuel.duree_label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
                  <div className="text-center">
                    <span className="text-white/30 text-[6px] sm:text-[7px] font-mono uppercase tracking-wider block">Jours restants</span>
                    <span className="text-white font-serif text-lg sm:text-xl md:text-2xl leading-none">{abonnementActuel.jours_restants || 0}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-white/30 text-[6px] sm:text-[7px] font-mono uppercase tracking-wider block">Échéance</span>
                    <span className="text-white text-[10px] sm:text-sm font-medium">
                      {abonnementActuel.date_fin ? new Date(abonnementActuel.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnnuler}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl text-[6px] sm:text-[8px] font-mono uppercase tracking-widest transition border border-red-500/20"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalogue - avec un padding bottom pour éviter que les cartes soient coupées */}
      {chargement ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 sm:h-48 md:h-52 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tarifsFiltres.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-32 gap-3 sm:gap-4"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-white/30 text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-mono">
            Aucune formule disponible
          </p>
          {estAdmin && (
            <button
              onClick={onAjouterTarif}
              style={{ color: theme.accentSage }}
              className="text-[8px] sm:text-[9px] font-mono tracking-wider uppercase hover:text-white transition-colors border border-[#aec3b0]/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-white/5"
            >
              Créer une formule
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div layout className="space-y-6 md:space-y-8 pb-8">
          {/* Affichage par catégorie pour un rendu plus artistique */}
          {filtrePlan === 'tous' ? (
            <>
              {/* Section Basic */}
              {tarifsBasic.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-4 sm:w-6 h-px bg-white/10" />
                    <h3 className="text-white/40 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest">Basic</h3>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {tarifsBasic.map((offre, index) => (
                      <CarteTarif 
                        key={`basic-${offre.duree}-${index}`}
                        offre={offre} 
                        estActif={aAbonnementActif}
                        estAuthentifie={estAuthentifie}
                        estAdmin={estAdmin}
                        onSouscrire={() => handleSouscrire(offre.plan, offre.duree)}
                        onModifier={() => onModifierTarif && onModifierTarif(offre)}
                        onSupprimer={() => onSupprimerTarif && onSupprimerTarif(offre.id, `${offre.plan} - ${getDureeLabel(offre.duree)}`)}
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Section Premium */}
              {tarifsPremium.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div className="w-4 sm:w-6 h-px bg-amber-500/20" />
                    <h3 className="text-amber-400/60 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest">Premium</h3>
                    <div className="flex-1 h-px bg-amber-500/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {tarifsPremium.map((offre, index) => (
                      <CarteTarif 
                        key={`premium-${offre.duree}-${index}`}
                        offre={offre} 
                        estActif={aAbonnementActif}
                        estAuthentifie={estAuthentifie}
                        estAdmin={estAdmin}
                        onSouscrire={() => handleSouscrire(offre.plan, offre.duree)}
                        onModifier={() => onModifierTarif && onModifierTarif(offre)}
                        onSupprimer={() => onSupprimerTarif && onSupprimerTarif(offre.id, `${offre.plan} - ${getDureeLabel(offre.duree)}`)}
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Affichage filtré
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {tarifsFiltres.map((offre, index) => (
                <CarteTarif 
                  key={`${offre.plan}-${offre.duree}-${index}`}
                  offre={offre} 
                  estActif={aAbonnementActif}
                  estAuthentifie={estAuthentifie}
                  estAdmin={estAdmin}
                  onSouscrire={() => handleSouscrire(offre.plan, offre.duree)}
                  onModifier={() => onModifierTarif && onModifierTarif(offre)}
                  onSupprimer={() => onSupprimerTarif && onSupprimerTarif(offre.id, `${offre.plan} - ${getDureeLabel(offre.duree)}`)}
                  theme={theme}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PanneauCatalogue;