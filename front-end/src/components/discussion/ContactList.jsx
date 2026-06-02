// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\discussion\ContactList.jsx
import { AnimatePresence, motion } from 'framer-motion';
import ContactItem from './ContactItem';

const ContactList = ({ 
  searchQuery, 
  setSearchQuery, 
  isSearchingGlobal, 
  displayList, 
  activeConversation, 
  onSelectConversation 
}) => {
  return (
    <div className="w-full md:w-2/5 h-2/5 md:h-full p-6 md:p-12 pt-24 md:pt-36 flex flex-col relative z-10 border-b md:border-b-0 md:border-r border-white/10 text-white">
      <div className="mb-6 select-none text-center md:text-left">
        <p className="font-mono text-[9px] tracking-[0.4em] text-[#aec3b0] uppercase italic">Messagerie</p>
        <h1 className="font-serif italic text-2xl md:text-4xl tracking-wide text-white mt-1">Correspondances</h1>
      </div>

      {/* Barre de Recherche Automatique */}
      <div className="relative w-full mb-6">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un utilisateur (ex: Lahatra, Ofélia)..."
          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#aec3b0] text-white rounded-2xl pl-10 pr-4 py-3 text-xs tracking-wide transition-all outline-none placeholder-white/30"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isSearchingGlobal ? (
            <span className="w-4 h-4 border-2 border-[#aec3b0] border-t-transparent rounded-full animate-spin block"/>
          ) : (
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          )}
        </div>
      </div>

      {/* Liste des contacts */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence>
          {displayList.length > 0 ? (
            displayList.map((item) => (
              <ContactItem 
                key={item.id || item.utilisateur_id}
                item={item}
                activeConversation={activeConversation}
                onSelect={onSelectConversation}
              />
            ))
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="font-serif italic text-xs text-center pt-8 text-[#aec3b0]"
            >
              Aucun utilisateur ou salon trouvé.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactList;