// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\discussion\ContactItem.jsx
import { motion, AnimatePresence } from 'framer-motion';

const ContactItem = ({ item, activeConversation, onSelect }) => {
  const isSelected = activeConversation 
    ? (item.id && activeConversation.id === item.id) || 
      (item.is_global_user && activeConversation.utilisateur_id === item.utilisateur_id)
    : false;
  
  const displayNom = item.is_global_user ? item.nom_complet : (item.photographe_nom || item.client_nom);
  const displayPhoto = item.is_global_user ? item.photo_profil : (item.photographe_photo || item.client_photo);
  const initiales = displayNom ? displayNom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??";
  const hasUnread = !item.is_global_user && item.non_lus_count > 0;

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
          ) : (
            <AnimatePresence>
              {hasUnread && (
                <motion.span
                  key="unread-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="relative flex items-center justify-center shrink-0"
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-50 animate-ping" />
                  <span className="relative min-w-[18px] h-[18px] px-1.5 flex items-center justify-center bg-gradient-to-br from-sky-300 to-sky-500 text-[#0f1610] text-[9px] font-bold rounded-full shadow-[0_0_10px_rgba(56,189,248,0.55)] ring-1 ring-white/40">
                    {item.non_lus_count > 9 ? '9+' : item.non_lus_count}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </div>
        <p className={`font-mono text-[9px] tracking-wider mt-1 uppercase truncate ${hasUnread ? 'text-white/90 font-semibold' : 'text-[#aec3b0]'}`}>
          {item.is_global_user ? `Rôle : ${item.role || 'Membre'}` : (item.dernier_message?.contenu || "Ouvrir le salon de discussion")}
        </p>
      </div>
    </motion.div>
  );
};

export default ContactItem;