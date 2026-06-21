import { motion } from 'framer-motion';
import { FEATURED } from './data/galleryData';

const FeaturedSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-charcoal to-sauge/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-gold font-mono text-[10px] tracking-[0.5em] uppercase">À l'honneur</span>
          <h2 className="text-ivory font-display italic text-5xl md:text-7xl mt-4">Les Incontournables</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden group"
            >
              <div className="aspect-[3/4]">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <span className="text-gold/80 font-mono text-[8px] tracking-[0.3em] uppercase">{img.category}</span>
                  <h3 className="text-ivory font-display italic text-2xl">{img.title}</h3>
                  <p className="text-ivory/50 text-xs">{img.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;