import { motion } from 'framer-motion';

const ArticleItem = ({ article, index, onRetirer, theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 1, 0.5, 1],
        delay: (index % 5) * 0.05
      }}
      className="group relative flex items-center gap-4 bg-white border border-[#2d3a30]/5 rounded-2xl p-4 hover:border-[#c9a96e]/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#2d3a30]/5 flex-shrink-0">
        <img 
          src={article.publication_image} 
          alt={article.publication_titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-base text-[#2d3a30] leading-tight group-hover:text-[#c9a96e] transition-colors duration-300 truncate">
          {article.publication_titre}
        </h4>
        <p className="text-[10px] text-[#2d3a30]/40 mt-0.5">
          Quantité: {article.quantite}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p style={{ color: theme.accentSage }} className="font-serif italic text-lg font-light">
          {parseFloat(article.prix_unitaire).toFixed(2)} €
        </p>
        {onRetirer && (
          <button
            onClick={() => onRetirer(article.publication)}
            className="text-[#2d3a30]/30 text-[9px] tracking-wider uppercase hover:text-red-500 transition-colors font-mono mt-1"
          >
            Retirer
          </button>
        )}
      </div>

      {/* Flèche discrète */}
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg className="w-4 h-4 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ArticleItem;