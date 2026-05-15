import { motion } from 'framer-motion';
import { useState } from 'react';

const EtapePhoto = ({ onNext, onBack }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-10 relative z-20 w-full flex flex-col items-center"
    >
      <div className="text-center">
        <p className="text-[#f5f5f1]/40 text-[9px] tracking-[0.4em] uppercase italic">
          Votre Portrait
        </p>
      </div>

      {/* ZONE D'UPLOAD CIRCULAIRE */}
      <div className="relative group">
        <label className="cursor-pointer block">
          <div className="w-32 h-32 rounded-full border border-[#f5f5f1]/10 flex items-center justify-center overflow-hidden relative transition-all duration-500 group-hover:border-[#c5a358]/50 bg-[#f5f5f1]/[0.02]">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c5a358" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            )}
            
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[#f5f5f1] text-[8px] tracking-[0.2em] uppercase font-light">Modifier</span>
            </div>
          </div>
          <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
        </label>
        
        {/* Petit cercle décoratif autour */}
        <div className="absolute -inset-2 border border-[#c5a358]/5 rounded-full scale-90 group-hover:scale-100 group-hover:border-[#c5a358]/20 transition-all duration-700" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-[#f5f5f1]/30 text-[9px] tracking-[0.1em] font-light max-w-[200px] mx-auto leading-relaxed">
          SÉLECTIONNEZ UNE IMAGE QUI REPRÉSENTE VOTRE IDENTITÉ VISUELLE.
        </p>
      </div>

      {/* BOUTONS */}
      <div className="flex flex-col gap-5 pt-6 w-full">
        <button 
          onClick={onNext} 
          className="w-full py-5 bg-[#c5a358] text-[#1a1a1a] rounded-[24px] font-serif italic text-xl hover:bg-[#f5f5f1] transition-all shadow-2xl flex justify-between px-10 items-center group"
        >
          <span className="tracking-wide">{preview ? "Continuer" : "Plus tard"}</span>
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

export default EtapePhoto;