// src/components/profil/collection/PublicationCard.jsx
import { motion } from 'framer-motion';

const PublicationCard = ({ pub, variants, onClick, isSelected }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      onClick={() => onClick(pub)}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col cursor-pointer ${
        isSelected
          ? 'border-[#2d3a30]/25 shadow-lg ring-1 ring-[#2d3a30]/10'
          : 'border-[#2d3a30]/5 shadow-xs hover:shadow-xl hover:border-[#2d3a30]/12'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1c251e]/5">
        <img
          src={pub.image_affichee}
          alt={pub.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Selected overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#2d3a30]/10"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-md font-mono text-[8px] tracking-wider uppercase backdrop-blur-md ${
            pub.type === 'vente'
              ? 'bg-amber-500/20 text-amber-900 border border-amber-500/20'
              : 'bg-sky-500/20 text-sky-900 border border-sky-500/20'
          }`}>
            {pub.type === 'vente' ? 'Série limitée' : 'Exposition'}
          </span>
        </div>
        {isSelected && (
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#2d3a30] flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif italic text-base text-[#2d3a30] mb-1 truncate">{pub.titre}</h3>
          <p className="font-sans text-xs text-[#2d3a30]/60 line-clamp-2 mb-3 font-light leading-relaxed">
            {pub.description || 'Aucun récit attaché.'}
          </p>
        </div>
        <div className="pt-3 border-t border-[#2d3a30]/5 flex justify-between items-center">
          <span className="font-mono text-xs font-medium text-[#2d3a30]">
            {pub.type === 'vente' ? `${parseFloat(pub.prix).toLocaleString()} MGA` : '—'}
          </span>
          <span className="font-mono text-[9px] text-[#2d3a30]/30 uppercase tracking-wider">
            Voir détail →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicationCard;