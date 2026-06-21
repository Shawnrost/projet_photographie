import { motion } from 'framer-motion';
import { HERO_STATS } from './data/galleryData';

const HeroStats = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4"
    >
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 bg-black/40 backdrop-blur-xl border border-ivory/10 rounded-2xl py-6 px-8">
        {HERO_STATS.map((stat, i) => (
          <div key={i} className="text-center">
            <span className="text-gold font-display italic text-2xl md:text-3xl">{stat.value}</span>
            <p className="text-ivory/50 font-mono text-[8px] tracking-[0.2em] uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HeroStats;