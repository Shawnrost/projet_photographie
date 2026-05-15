import { motion } from 'framer-motion';

const EtapeIdentite = ({ onNext, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-10 relative z-20 w-full"
    >
      <div className="text-center">
        <p className="text-[#f5f5f1]/40 text-[9px] tracking-[0.4em] uppercase italic">
          Informations personnelles
        </p>
      </div>

      <div className="space-y-8">
        {/* PRÉNOM - Ligne complète */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="PRÉNOM" 
            className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-4 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all placeholder:text-[#f5f5f1]/20 font-light" 
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#c5a358] group-focus-within:w-full transition-all duration-500" />
        </div>

        {/* NOM - Ligne complète */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="NOM" 
            className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-4 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all placeholder:text-[#f5f5f1]/20 font-light" 
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#c5a358] group-focus-within:w-full transition-all duration-500" />
        </div>

        {/* EMAIL - Ligne complète */}
        <div className="relative group">
          <input 
            type="email" 
            placeholder="ADRESSE EMAIL" 
            className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-4 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all placeholder:text-[#f5f5f1]/20 font-light" 
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#c5a358] group-focus-within:w-full transition-all duration-500" />
        </div>
      </div>

      {/* BOUTONS */}
      <div className="flex flex-col gap-5 pt-6">
        <button 
          onClick={onNext} 
          className="w-full py-5 bg-[#c5a358] text-[#1a1a1a] rounded-[24px] font-serif italic text-xl hover:bg-[#f5f5f1] transition-all shadow-2xl flex justify-between px-10 items-center group"
        >
          <span className="tracking-wide">Continuer</span>
          <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
        </button>

        <button 
          onClick={onBack} 
          className="w-full py-2 text-[#f5f5f1]/20 text-[9px] uppercase tracking-[0.5em] hover:text-[#c5a358] transition-all font-light text-center"
        >
          Retour
        </button>
      </div>
    </motion.div>
  );
};

export default EtapeIdentite;