import { motion, AnimatePresence } from 'framer-motion';

const InformationTab = ({ 
  isEditing, 
  setIsEditing, 
  formData, 
  setFormData, 
  previewPhoto, 
  handlePhotoClick, 
  fileInputRef, 
  handleFileChange, 
  handleSave, 
  handleCancel, 
  initiales, 
  user 
}) => {
  return (
    <div className="space-y-6 max-w-xl">
      {/* ZONE PHOTO DE PROFIL ET MODIFICATION */}
      <div className="flex flex-col items-center sm:flex-row gap-6 bg-white/40 border border-black/[0.02] p-5 rounded-3xl backdrop-blur-sm shadow-sm">
        <div 
          onClick={handlePhotoClick}
          className={`w-20 h-20 rounded-full relative overflow-hidden group select-none ${isEditing ? 'cursor-pointer ring-2 ring-gold/40 ring-offset-2' : ''}`}
        >
          {previewPhoto || user?.photo_profil ? (
            <img src={previewPhoto || user.photo_profil} alt="Atelier Profil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#2d3a30]/5 flex items-center justify-center text-[#2d3a30] font-serif text-2xl italic font-light">{initiales}</div>
          )}
          
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="font-mono text-[7px] tracking-widest uppercase">Changer</span>
            </div>
          )}
        </div>
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="text-center sm:text-left space-y-1">
          <h4 className="font-serif italic text-base text-[#2d3a30]">Visuel de l'Atelier</h4>
          <p className="font-sans text-xs text-[#2d3a30]/50 max-w-xs leading-relaxed">
            {isEditing 
              ? "Cliquez sur la lentille de l'avatar pour téléverser une nouvelle capture artistique de votre visage."
              : "Passez en mode modification pour actualiser l'image de marque de votre studio."}
          </p>
        </div>
      </div>

      {/* FORMULAIRE DYNAMIQUE */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Prénom */}
          <div className="space-y-1">
            <label className="font-mono text-[8px] tracking-widest text-[#2d3a30]/60 uppercase ml-2">Prénom</label>
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div key="view-prenom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white/60 border border-black/[0.02] rounded-2xl px-4 py-3 text-sm font-sans text-[#2d3a30] shadow-sm select-all">
                  {formData.prenom}
                </motion.div>
              ) : (
                <motion.input key="edit-prenom" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="w-full bg-white border border-[#2d3a30]/10 focus:border-gold/40 rounded-2xl px-4 py-3 text-sm outline-none transition-all shadow-inner" />
              )}
            </AnimatePresence>
          </div>

          {/* Nom */}
          <div className="space-y-1">
            <label className="font-mono text-[8px] tracking-widest text-[#2d3a30]/60 uppercase ml-2">Nom</label>
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div key="view-nom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white/60 border border-black/[0.02] rounded-2xl px-4 py-3 text-sm font-sans text-[#2d3a30] shadow-sm select-all">
                  {formData.nom}
                </motion.div>
              ) : (
                <motion.input key="edit-nom" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full bg-white border border-[#2d3a30]/10 focus:border-gold/40 rounded-2xl px-4 py-3 text-sm outline-none transition-all shadow-inner" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="font-mono text-[8px] tracking-widest text-[#2d3a30]/60 uppercase ml-2">Email de correspondance</label>
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div key="view-email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white/60 border border-black/[0.02] rounded-2xl px-4 py-3 text-sm font-sans text-[#2d3a30] shadow-sm select-all">
                {formData.email}
              </motion.div>
            ) : (
              <motion.input key="edit-email" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-[#2d3a30]/10 focus:border-gold/40 rounded-2xl px-4 py-3 text-sm outline-none transition-all shadow-inner" />
            )}
          </AnimatePresence>
        </div>

        {/* Bio / Signature */}
        <div className="space-y-1">
          <label className="font-mono text-[8px] tracking-widest text-[#2d3a30]/60 uppercase ml-2">Signature Artistique (Bio)</label>
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div key="view-bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white/60 border border-black/[0.02] rounded-2xl px-4 py-3.5 text-sm font-sans text-[#2d3a30] leading-relaxed shadow-sm select-all whitespace-pre-wrap">
                {formData.bio}
              </motion.div>
            ) : (
              <motion.textarea key="edit-bio" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-white border border-[#2d3a30]/10 focus:border-gold/40 rounded-2xl px-4 py-3 text-sm outline-none transition-all shadow-inner resize-none leading-relaxed" />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* BARRE D'ACTIONS INFÉRIEURE ANIMÉE */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="flex gap-4 pt-3 border-t border-[#2d3a30]/10"
          >
            <button 
              onClick={handleCancel}
              className="px-6 py-3 border border-[#2d3a30]/20 rounded-2xl font-mono text-[9px] tracking-widest uppercase text-[#2d3a30]/60 hover:text-[#2d3a30] transition-all"
            >
              Annuler
            </button>
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(45,58,48,0.15)" }} 
              whileTap={{ scale: 0.98 }} 
              onClick={handleSave}
              className="px-8 py-3 bg-[#2d3a30] text-white rounded-2xl font-mono text-[9px] tracking-widest uppercase transition-all shadow-md"
            >
              Enregistrer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InformationTab;