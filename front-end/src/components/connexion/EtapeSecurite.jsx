import { motion } from 'framer-motion';
import { useState } from 'react';

const EtapeSecurite = ({ onSubmit, onBack, loading }) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleTriggerSubmit = () => {
    // Transmet les clés exactes demandées par ton validateur Django backend
    onSubmit({ 
      password: password, 
      password_confirm: passwordConfirm 
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 relative z-20">
      <p className="text-[#f5f5f1]/40 text-[8px] tracking-[0.3em] uppercase italic text-center">Protection du compte</p>
      
      <input 
        type="password" 
        placeholder="MOT DE PASSE" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-3 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all" 
      />
      
      <input 
        type="password" 
        placeholder="CONFIRMER LE MOT DE PASSE" 
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        className="w-full bg-transparent border-b border-[#f5f5f1]/10 py-3 text-[#f5f5f1] text-[10px] tracking-[0.3em] outline-none focus:border-[#c5a358] transition-all" 
      />
      
      <div className="flex flex-col gap-3 pt-4">
        <button 
          onClick={handleTriggerSubmit}
          disabled={loading}
          className="w-full py-4 bg-[#f5f5f1] text-[#1a1a1a] rounded-[20px] font-serif italic text-lg hover:bg-[#c5a358] transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? "Création en cours..." : "Créer mon profil"}
        </button>
        
        <button 
          onClick={onBack} 
          disabled={loading}
          className="w-full py-1 text-[#f5f5f1]/20 text-[8px] uppercase tracking-[0.3em] hover:text-[#c5a358] transition-all disabled:opacity-30"
        >
          Retour
        </button>
      </div>
    </motion.div>
  );
};

export default EtapeSecurite;