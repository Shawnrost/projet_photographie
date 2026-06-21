import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GALLERY, CATEGORIES } from './data/galleryData';
import GalleryModal from './GalleryModal';

const GalleryGrid = () => {
  const [filter, setFilter] = useState("Tous");
  const [selectedId, setSelectedId] = useState(null);

  const filteredImages = filter === "Tous" 
    ? GALLERY 
    : GALLERY.filter(img => img.category === filter);

  const selectedImage = GALLERY.find(img => img.id === selectedId);

  return (
    <section className="py-32 px-4 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-gold font-mono text-[10px] tracking-[0.5em] uppercase">Portfolio</span>
          <h2 className="text-ivory font-display italic text-6xl md:text-8xl mt-4">La Galerie</h2>
          <div className="w-24 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        {/* Filtres */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500 ${
                filter === cat 
                  ? 'bg-gold text-charcoal' 
                  : 'border border-ivory/20 text-ivory/60 hover:border-gold/40 hover:text-ivory'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grille */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredImages.map((img, index) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedId(img.id)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl bg-sauge/10"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-gold font-mono text-[8px] tracking-[0.3em] uppercase">{img.category}</span>
                  <h3 className="text-ivory font-display italic text-2xl mt-1">{img.title}</h3>
                  <p className="text-ivory/60 text-sm font-light">{img.sub}</p>
                  <div className="flex items-center gap-4 mt-3 text-ivory/40 text-[9px]">
                    <span>👁 {img.stats.views}</span>
                    <span>❤ {img.stats.likes}</span>
                    <span>💬 {img.stats.comments}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedId && <GalleryModal image={selectedImage} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default GalleryGrid;