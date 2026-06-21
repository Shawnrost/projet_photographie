import { motion } from 'framer-motion';

const CommandeCard = ({ commande, index, theme }) => {
  const getStatusLabel = (status) => {
    const labels = {
      en_attente: 'En attente',
      paye: 'Payé ✅',
      annule: 'Annulé ❌'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      en_attente: 'text-yellow-600/60 border-yellow-400/20 bg-yellow-400/10',
      paye: 'text-green-600/60 border-green-400/20 bg-green-400/10',
      annule: 'text-red-600/60 border-red-400/20 bg-red-400/10'
    };
    return colors[status] || 'text-[#2d3a30]/40 border-[#2d3a30]/10 bg-[#2d3a30]/5';
  };

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
      className="bg-white border border-[#2d3a30]/5 rounded-2xl p-4 hover:border-[#c9a96e]/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#2d3a30]/5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono tracking-wider ${getStatusColor(commande.status)}`}>
            {getStatusLabel(commande.status)}
          </span>
          <span className="text-[#2d3a30]/30 text-[9px] font-mono tracking-wider">
            {new Date(commande.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="text-right">
          <p style={{ color: theme.accentSage }} className="font-serif italic text-lg font-light">
            {parseFloat(commande.prix_a_payer).toFixed(2)} €
          </p>
          <span className="text-[#2d3a30]/20 text-[9px] font-mono tracking-wider">
            {commande.articles?.length || 0} article(s)
          </span>
        </div>
      </div>

      {commande.articles && commande.articles.length > 0 && (
        <div className="mt-3 space-y-2">
          {commande.articles.map((article, idx) => (
            <div key={article.id} className="flex items-center gap-3 text-sm">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2d3a30]/5 flex-shrink-0">
                <img 
                  src={article.publication_image} 
                  alt={article.publication_titre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#2d3a30]/80 text-xs font-light truncate">
                  {article.publication_titre}
                </p>
              </div>
              <p className="text-[#2d3a30]/40 text-xs font-mono tabular-nums">
                {parseFloat(article.prix_unitaire).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CommandeCard;