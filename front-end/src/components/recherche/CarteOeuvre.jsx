import { motion } from 'framer-motion';

const CarteOeuvre = ({ item, onOpenPopup }) => {
  const handleClick = () => {
    if (onOpenPopup) {
      onOpenPopup(item);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    // TODO: Implémenter le like
    console.log('Like publication:', item.id);
  };

  const getTypeLabel = (type) => {
    const types = {
      publicite: 'Publicité',
      vente: 'À vendre'
    };
    return types[type] || type;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleClick}
      className="group relative flex flex-col bg-white border border-[#2d3a30]/5 rounded-2xl overflow-hidden p-2 shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
    >
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#2d3a30]/5 relative">
        <img 
          src={item.image_affichee || 'https://via.placeholder.com/600x450?text=No+Image'} 
          alt={item.titre} 
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000 ease-out" 
        />
        
        {/* Badge type */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#2d3a30] font-mono text-[7.5px] font-medium tracking-widest uppercase px-2 py-1 rounded-md">
          {getTypeLabel(item.type)}
        </span>

        {/* Badge vendu */}
        {item.est_vendue && (
          <span className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-white font-mono text-[7.5px] font-medium tracking-widest uppercase px-2 py-1 rounded-md">
            Vendu
          </span>
        )}

        {/* Badge prix */}
        {item.type === 'vente' && item.prix && !item.est_vendue && (
          <span className="absolute bottom-3 right-3 bg-[#2d3a30]/90 backdrop-blur-md text-white font-mono text-[9px] font-medium px-2 py-1 rounded-md">
            {parseFloat(item.prix).toFixed(2)} €
          </span>
        )}

        {/* Nombre de likes */}
        {item.nombre_likes > 0 && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#2d3a30] font-mono text-[7.5px] px-2 py-1 rounded-md flex items-center gap-1">
            <svg className="w-3 h-3" fill={item.a_like ? '#e74c3c' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {item.nombre_likes}
          </span>
        )}
      </div>
      
      <div className="pt-3 pb-1 px-1 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base text-[#2d3a30] leading-tight group-hover:text-[#c9a96e] transition-colors duration-300 truncate">
            {item.titre}
          </h3>
          
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-sans text-[10px] text-[#2d3a30]/50 tracking-wide truncate">
              par {item.photographe_nom || 'Inconnu'}
            </p>
            
            {/* Catégories */}
            {item.categories && item.categories.length > 0 && (
              <span className="text-[#2d3a30]/20">•</span>
            )}
            {item.categories && item.categories.slice(0, 2).map((cat) => (
              <span key={cat.id} className="font-mono text-[7px] text-[#2d3a30]/30 uppercase tracking-wider">
                {cat.nom}
              </span>
            ))}
          </div>
        </div>
        
        {/* Bouton Like */}
        <button 
          onClick={handleLike}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-2 ${
            item.a_like 
              ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
              : 'border-[#2d3a30]/10 hover:bg-[#2d3a30] hover:text-white text-[#2d3a30]/40'
          }`}
        >
          <svg className="w-3 h-3" fill={item.a_like ? '#e74c3c' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default CarteOeuvre;