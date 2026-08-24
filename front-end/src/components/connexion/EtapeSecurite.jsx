import { motion } from 'framer-motion';
import { useState } from 'react';

const EtapeSecurite = ({ onSubmit, onBack, loading, role }) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const estPhotographe = role === 'photographe';

  const handleTriggerSubmit = () => {
    // Transmet les clés exactes demandées par le validateur Django backend
    onSubmit({ 
      password: password, 
      password_confirm: passwordConfirm 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-6 relative z-20 w-full"
    >
      <p className="text-[#f5f5f1]/40 text-[8px] tracking-[0.3em] uppercase italic text-center">
        Protection du compte
      </p>
      
      <div className="space-y-4">
        <div className="relative group">
          <input 
            type="password" 
            placeholder="MOT DE PASSE" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-3 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all placeholder:text-[#f5f5f1]/20 font-light" 
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#c5a358] group-focus-within:w-full transition-all duration-500" />
        </div>
        
        <div className="relative group">
          <input 
            type="password" 
            placeholder="CONFIRMER LE MOT DE PASSE" 
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-3 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all placeholder:text-[#f5f5f1]/20 font-light" 
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#c5a358] group-focus-within:w-full transition-all duration-500" />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 pt-4">
        <button 
          onClick={handleTriggerSubmit}
          disabled={loading}
          className={`w-full py-5 text-[#1a1a1a] rounded-[24px] font-serif italic text-xl transition-all shadow-2xl flex justify-between px-10 items-center group disabled:opacity-50 ${
            estPhotographe 
              ? 'bg-[#c5a358] hover:bg-[#f5f5f1]' 
              : 'bg-[#f5f5f1] hover:bg-[#c5a358]'
          }`}
        >
          <span className="tracking-wide">
            {loading 
              ? "Création en cours..." 
              : "Créer mon profil"
            }
          </span>
          {!loading && <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>}
        </button>
        
        <button 
          onClick={onBack} 
          disabled={loading}
          className="w-full py-2 text-[#f5f5f1]/20 text-[9px] uppercase tracking-[0.5em] hover:text-[#c5a358] transition-all disabled:opacity-30 font-light text-center"
        >
          Retour
        </button>
      </div>
    </motion.div>
  );
};

export default EtapeSecurite;