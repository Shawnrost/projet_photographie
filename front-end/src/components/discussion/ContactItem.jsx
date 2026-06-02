// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\discussion\ContactItem.jsx
import { motion } from 'framer-motion';

const ContactItem = ({ item, activeConversation, onSelect }) => {
  const isSelected = activeConversation?.id === item.id && item.id !== null;
  
  const displayNom = item.is_global_user ? item.nom_complet : (item.photographe_nom || item.client_nom);
  const displayPhoto = item.is_global_user ? item.photo_profil : (item.photographe_photo || item.client_photo);
  const initiales = displayNom ? displayNom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={() => onSelect(item)}
      whileHover={{ x: isSelected ? 0 : 4 }}
      className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${
        isSelected 
          ? 'bg-white/10 border-white/20 shadow-lg backdrop-blur-md' 
          : 'bg-transparent border-transparent hover:bg-white/5'
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-[#1c251e]/60 border border-[#aec3b0]/40 flex items-center justify-center relative font-serif italic text-sm text-[#aec3b0] overflow-hidden shrink-0">
        {displayPhoto ? (
          <img src={displayPhoto} alt={displayNom} className="w-full h-full object-cover" />
        ) : (
          <span>{initiales}</span>
        )}
      </div>

      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <h4 className="font-sans text-sm font-medium tracking-wide leading-none truncate">{displayNom}</h4>
          
          {item.is_global_user ? (
            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[8px] font-mono px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
              En Base
            </span>
          ) : item.non_lus_count > 0 && (
            <span className="bg-sky-400 text-[#2d3a30] text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
              {item.non_lus_count}
            </span>
          )}
        </div>
        <p className="font-mono text-[9px] text-[#aec3b0] tracking-wider mt-1 uppercase truncate">
          {item.is_global_user ? `Rôle : ${item.role || 'Membre'}` : (item.dernier_message?.contenu || "Ouvrir le salon de discussion")}
        </p>
      </div>
    </motion.div>
  );
};

export default ContactItem;