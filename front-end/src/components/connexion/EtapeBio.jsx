import { motion } from 'framer-motion';

const EtapeBio = ({ onNext, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 relative z-20">
    <p className="text-[#f5f5f1]/40 text-[8px] tracking-[0.3em] uppercase italic text-center">Votre vision artistique</p>
    <textarea 
      placeholder="DÉCRIVEZ VOTRE DÉMARCHE EN QUELQUES MOTS..." 
      className="w-full bg-transparent border border-[#f5f5f1]/10 rounded-2xl p-4 text-[#f5f5f1] text-[10px] tracking-[0.1em] outline-none focus:border-[#c5a358] transition-all h-32 resize-none"
    />
    <div className="flex flex-col gap-3">
      <button onClick={onNext} className="w-full py-4 bg-[#c5a358] text-[#1a1a1a] rounded-[20px] font-serif italic text-lg hover:bg-[#f5f5f1] transition-all flex justify-center items-center gap-2">Continuer →</button>
      <button onClick={onBack} className="w-full py-1 text-[#f5f5f1]/20 text-[8px] uppercase tracking-[0.3em] hover:text-[#c5a358] transition-all">Retour</button>
    </div>
  </motion.div>
);

export default EtapeBio;