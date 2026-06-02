// src/components/profil/collection/CollectionHeader.jsx
import { motion } from 'framer-motion';

const CollectionHeader = ({ publicationsCount, hasActiveSubscription, subscriptionDetails, onOpenModal }) => {
  return (
    <div className="w-full flex justify-between items-center mb-8">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[10px] tracking-widest text-[#2d3a30]/60 uppercase">
          {publicationsCount} publication{publicationsCount > 1 ? 's' : ''} d'art
        </p>
        {hasActiveSubscription && subscriptionDetails && (
          <span className="font-mono text-[8px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit uppercase tracking-wider">
            Compte {subscriptionDetails.type} — {subscriptionDetails.jours_restants} jours restants
          </span>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.03, backgroundColor: "#2d3a30", color: "#f8f9f8" }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpenModal}
        className="px-5 py-2.5 bg-transparent border border-[#2d3a30]/20 text-[#2d3a30] rounded-xl font-mono text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-xs"
      >
        <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle Création
      </motion.button>
    </div>
  );
};

export default CollectionHeader;