import { motion } from 'framer-motion';

const GalleryModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative max-w-5xl w-full bg-charcoal rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/60 text-ivory text-xs tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-300 border border-ivory/20"
        >
          ✕
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/5 h-[300px] md:h-auto">
            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="text-gold font-mono text-[9px] tracking-[0.4em] uppercase">{image.category}</span>
              <h2 className="text-ivory font-display italic text-4xl mt-2">{image.title}</h2>
              <p className="text-ivory/60 text-sm mt-1">{image.sub}</p>
              <div className="w-16 h-[1px] bg-gold/30 my-6" />
              <div className="space-y-4 text-ivory/70 text-sm">
                <p><span className="text-gold/60 font-mono text-[9px] uppercase tracking-wider">Lieu</span><br />{image.location}</p>
                <p><span className="text-gold/60 font-mono text-[9px] uppercase tracking-wider">Photographe</span><br />{image.artist}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-black/20 rounded-2xl">
                {Object.entries(image.tech).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-gold/40 font-mono text-[7px] uppercase tracking-wider">{key}</span>
                    <p className="text-ivory text-sm font-light">{val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-ivory/10 text-ivory/60 text-xs">
              <span>👁 {image.stats.views}</span>
              <span>❤ {image.stats.likes}</span>
              <span>💬 {image.stats.comments}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GalleryModal;