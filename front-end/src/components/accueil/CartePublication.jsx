import { motion } from 'framer-motion';

const CartePublication = ({ pub, idx, liked, onLike, onClick, theme }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: (idx % 8) * 0.04 }}
      onClick={onClick}
      style={{ backgroundColor: theme.bgCard }}
      className="group relative border border-white/[0.06] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:border-white/20 hover:shadow-md transition-all duration-500"
    >
      {/* Zone de l'image réduite en format 4/3 */}
      <div className="relative overflow-hidden aspect-[4/3] bg-black/10">
        <motion.img
          src={pub.image_affichee}
          alt={pub.titre}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Voile sombre progressif au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Informations compactes au survol */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <p className="text-white font-serif italic text-sm leading-tight line-clamp-1 mb-0.5">
            {pub.titre}
          </p>
          {pub.categories?.[0] && (
            <p style={{ color: theme.accentSage }} className="text-[8px] tracking-[0.2em] uppercase font-mono">
              {pub.categories[0].nom}
            </p>
          )}
        </div>

        {/* Badges d'état de la vente plus petits */}
        {pub.type === 'vente' && !pub.est_vendue && pub.prix && (
          <div style={{ backgroundColor: theme.bg, borderColor: 'rgba(255,255,255,0.15)' }} className="absolute top-2.5 left-2.5 px-2 py-0.5 border backdrop-blur-md rounded-md">
            <span style={{ color: theme.accentSage }} className="text-[9px] font-mono font-medium tracking-wide">
              {parseFloat(pub.prix).toFixed(2)} €
            </span>
          </div>
        )}
        {pub.est_vendue && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/40 border border-white/5 backdrop-blur-sm rounded-md">
            <span className="text-white/30 text-[8px] tracking-widest uppercase font-mono">Acquis</span>
          </div>
        )}
      </div>

      {/* Pied de la carte plus fin */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/[0.1] border-t border-white/[0.05]">
        <div className="flex items-center gap-1.5 min-w-0">
          {pub.photographe_photo ? (
            <img 
              src={pub.photographe_photo} 
              alt={pub.photographe_nom}
              className="w-4 h-4 rounded-full object-cover border border-white/10 flex-shrink-0"
            />
          ) : (
            <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 bg-white/5">
              <span className="text-white/60 text-[7px] uppercase">{pub.photographe_nom?.[0]}</span>
            </div>
          )}
          <span className="text-[#f8f9f8]/60 text-[10px] tracking-wide truncate font-light group-hover:text-white transition-colors">
            {pub.photographe_nom}
          </span>
        </div>

        {/* Bouton Mention J'aime discret */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLike(pub.id, e);
          }} 
          className="flex items-center gap-1 flex-shrink-0 group/like transition-all hover:scale-105"
        >
          <motion.span
            key={liked ? 'on' : 'off'}
            initial={{ scale: 0.85 }} 
            animate={{ scale: 1 }}
            style={{ color: liked ? theme.accentSage : 'inherit' }}
            className={`text-[11px] transition-colors ${!liked && 'text-white/30 group-hover/like:text-white/60'}`}
          >
            {liked ? '♥' : '♡'}
          </motion.span>
          <span className={`text-[10px] font-mono tabular-nums ${liked ? 'text-[#f8f9f8]' : 'text-white/30'}`}>
            {pub.nombre_likes}
          </span>
        </button>
      </div>
    </motion.article>
  );
};

export default CartePublication;