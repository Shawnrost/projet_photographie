import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PanierVide = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-4/5 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-[#2d3a30]/5 border border-[#2d3a30]/10 flex items-center justify-center mb-6">
        <span className="text-3xl">🛒</span>
      </div>
      <h3 className="font-serif italic text-2xl text-[#2d3a30] font-light mb-2">
        Votre panier est vide
      </h3>
      <p className="text-[#2d3a30]/40 text-sm font-light max-w-sm">
        Explorez la galerie et ajoutez des œuvres qui vous inspirent.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{ color: theme.accentSage }}
        className="mt-6 px-6 py-3 rounded-xl border border-[#aec3b0]/30 text-xs tracking-wider uppercase hover:bg-[#aec3b0]/10 transition-all"
      >
        Explorer la galerie
      </button>
    </motion.div>
  );
};

export default PanierVide;