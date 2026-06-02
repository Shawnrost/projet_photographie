// src/components/profil/collection/UploadModal.jsx
import { motion, AnimatePresence } from 'framer-motion';

const UploadModal = ({
  isOpen,
  onClose,
  uploading,
  onSubmit,
  categories,
  hasActiveSubscription,
  formData,
  setFormData,
  previews,
  fileInputRef,
  onPhotoClick,
  onFileChange,
  onRemoveImage
}) => {

  const spring = { type: 'spring', stiffness: 320, damping: 32 };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.97, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { ...spring, delay: 0.04 } },
    exit:    { opacity: 0, scale: 0.97, y: 18, transition: { duration: 0.18 } }
  };

  const rise = (i) => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.055, duration: 0.32, ease: 'easeOut' } }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-y-0 right-0 left-[40%] z-50 flex items-center justify-center p-6">

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => !uploading && onClose()}
            className="absolute inset-0 bg-[#1c251e]/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-lg bg-[#f7f8f7] rounded-[28px] border border-white/80 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '92vh' }}
          >

            {/* ── Header ── */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 shrink-0">
              <div>
                <span className="font-mono text-[7px] tracking-[0.5em] text-[#2d3a30]/30 uppercase block mb-1">
                  Laboratoire Visuel
                </span>
                <h3 className="font-serif text-[22px] italic text-[#2d3a30] tracking-wide leading-tight">
                  Composer une publication
                </h3>
              </div>
              <motion.button
                type="button"
                disabled={uploading}
                onClick={onClose}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(45,58,48,0.08)' }}
                whileTap={{ scale: 0.92 }}
                className="mt-1 w-7 h-7 rounded-full bg-white/70 border border-[#2d3a30]/8 flex items-center justify-center text-[#2d3a30]/40 text-[11px] transition-colors shrink-0"
              >
                ✕
              </motion.button>
            </div>

            {/* ── Thin divider ── */}
            <div className="mx-7 h-px bg-[#2d3a30]/6 shrink-0" />

            {/* ── Scrollable body ── */}
            <form
              onSubmit={onSubmit}
              className="flex-1 overflow-y-auto px-7 py-5 space-y-5"
              style={{ scrollbarWidth: 'none' }}
            >

              {/* INPUT FILE HIDDEN */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* ── Upload zone ── */}
              <motion.div variants={rise(0)} initial="hidden" animate="visible">
                <p className="font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase mb-2.5">
                  Négatifs · Photographies
                </p>

                {/* Empty state — horizontal pill */}
                {previews.length === 0 && (
                  <motion.div
                    onClick={onPhotoClick}
                    whileHover="hover"
                    className="relative cursor-pointer rounded-2xl overflow-hidden"
                    style={{ height: 96 }}
                  >
                    {/* Background: dark organic texture */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, #2d3a30 0%, #1e2820 50%, #2d3a30 100%)',
                      }}
                    />
                    {/* Subtle grid pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)',
                      }}
                    />
                    {/* Hover shimmer */}
                    <motion.div
                      variants={{ hover: { opacity: 1 } }}
                      initial={{ opacity: 0 }}
                      className="absolute inset-0"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                    {/* Content */}
                    <div className="relative h-full flex items-center justify-center gap-3">
                      <motion.div
                        variants={{ hover: { scale: 1.15, rotate: 8 } }}
                        transition={spring}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
                      >
                        <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </motion.div>
                      <div>
                        <p className="font-serif italic text-sm text-white/70 leading-none mb-1">
                          Déposer une photographie
                        </p>
                        <p className="font-mono text-[8px] tracking-widest text-white/30 uppercase">
                          JPG · PNG · WEBP
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* With previews — filmstrip row */}
                {previews.length > 0 && (
                  <div className="flex gap-2.5 items-center flex-wrap">
                    <AnimatePresence>
                      {previews.map((preview, index) => (
                        <motion.div
                          key={preview.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.75 }}
                          transition={spring}
                          className="relative rounded-xl overflow-hidden shrink-0 border border-black/8"
                          style={{ width: 80, height: 80 }}
                        >
                          <img src={preview.url} alt="" className="w-full h-full object-cover" />
                          {/* Dark overlay on hover */}
                          <motion.div
                            whileHover={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/30 transition-opacity"
                          />
                          <motion.button
                            type="button"
                            onClick={() => onRemoveImage(preview.id, index)}
                            whileHover={{ scale: 1.15 }}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-[9px]"
                          >
                            ✕
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Add more — same height */}
                    <motion.div
                      onClick={onPhotoClick}
                      whileHover={{ borderColor: 'rgba(56,189,248,0.4)', backgroundColor: 'rgba(45,58,48,0.04)' }}
                      className="rounded-xl border border-dashed border-[#2d3a30]/15 flex items-center justify-center cursor-pointer transition-all shrink-0"
                      style={{ width: 80, height: 80 }}
                    >
                      <svg className="w-4 h-4 text-[#2d3a30]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* ── Titre ── */}
              <motion.div variants={rise(1)} initial="hidden" animate="visible" className="space-y-1.5">
                <label className="block font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase">
                  Nom de la collection · Œuvre <span className="text-rose-400/80">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  placeholder="Ex : Éclats de l'Océan Indien"
                  className="w-full px-4 py-2.5 bg-white/80 border border-[#2d3a30]/8 rounded-xl font-sans text-[13px] text-[#2d3a30] placeholder-[#2d3a30]/25 focus:outline-none focus:border-sky-400/40 focus:bg-white transition-all"
                />
              </motion.div>

              {/* ── Récit ── */}
              <motion.div variants={rise(2)} initial="hidden" animate="visible" className="space-y-1.5">
                <label className="block font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase">
                  Récit artistique
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="L'histoire cachée derrière cette pellicule…"
                  className="w-full px-4 py-2.5 bg-white/80 border border-[#2d3a30]/8 rounded-xl font-sans text-[13px] text-[#2d3a30] placeholder-[#2d3a30]/25 focus:outline-none focus:border-sky-400/40 transition-all resize-none"
                />
              </motion.div>

              {/* ── Destination + Prix ── */}
              <motion.div variants={rise(3)} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase">
                    Destination
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, prix: e.target.value === 'publicite' ? '' : formData.prix })}
                    className="w-full px-3.5 py-2.5 bg-white/80 border border-[#2d3a30]/8 rounded-xl font-sans text-[13px] text-[#2d3a30] focus:outline-none focus:border-sky-400/40 transition-all"
                  >
                    <option value="publicite">Exposition numérique (Gratuit)</option>
                    <option value="vente">Série limitée commerciale</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase">
                    Valeur (MGA)
                  </label>
                  <motion.input
                    animate={{ opacity: formData.type === 'publicite' ? 0.35 : 1 }}
                    transition={{ duration: 0.2 }}
                    type="number"
                    disabled={formData.type === 'publicite'}
                    required={formData.type === 'vente'}
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    placeholder={formData.type === 'publicite' ? 'Non commercialisable' : 'Ex : 250 000'}
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-mono text-[13px] text-[#2d3a30] focus:outline-none transition-all ${
                      formData.type === 'publicite'
                        ? 'bg-[#2d3a30]/[0.03] border-transparent text-[#2d3a30]/30'
                        : 'bg-white/80 border-[#2d3a30]/8 focus:border-amber-400/50'
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {formData.type === 'vente' && !hasActiveSubscription && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="col-span-2 text-[9px] text-amber-500 font-mono tracking-wide"
                    >
                      ⚠️ Plan Premium ou Basic requis pour la mise en vente.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── Thématique + Tags ── */}
              <motion.div variants={rise(4)} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase">
                    Thématique
                  </label>
                  <select
                    value={formData.categorieId}
                    onChange={(e) => setFormData({ ...formData, categorieId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/80 border border-[#2d3a30]/8 rounded-xl font-sans text-[13px] text-[#2d3a30] focus:outline-none focus:border-sky-400/40 transition-all"
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[8.5px] tracking-widest text-[#2d3a30]/40 uppercase">
                    Indexation · Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    placeholder="fineart, monochrome, lumière"
                    className="w-full px-3.5 py-2.5 bg-white/80 border border-[#2d3a30]/8 rounded-xl font-sans text-[13px] text-[#2d3a30] placeholder-[#2d3a30]/25 focus:outline-none focus:border-sky-400/40 transition-all"
                  />
                </div>
              </motion.div>

            </form>

            {/* ── Footer ── */}
            <motion.div
              variants={rise(5)}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between px-7 py-4 border-t border-[#2d3a30]/6 bg-white/30 shrink-0"
            >
              {/* Step hint */}
              <p className="font-mono text-[8px] tracking-widest text-[#2d3a30]/25 uppercase hidden sm:block">
                {previews.length > 0 ? `${previews.length} photo${previews.length > 1 ? 's' : ''} sélectionnée${previews.length > 1 ? 's' : ''}` : 'Aucune photo'}
              </p>

              <div className="flex items-center gap-2.5 ml-auto">
                <motion.button
                  type="button"
                  disabled={uploading}
                  onClick={onClose}
                  whileHover={{ backgroundColor: 'rgba(45,58,48,0.06)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-xl font-mono text-[9.5px] uppercase tracking-widest text-[#2d3a30]/45 transition-colors"
                >
                  Fermer
                </motion.button>

                <motion.button
                  type="submit"
                  form={undefined}
                  onClick={onSubmit}
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.03 }}
                  whileTap={{ scale: uploading ? 1 : 0.97 }}
                  className="relative px-6 py-2.5 bg-[#2d3a30] text-white rounded-xl font-mono text-[9.5px] uppercase tracking-widest overflow-hidden flex items-center gap-2"
                >
                  <AnimatePresence>
                    {uploading && (
                      <motion.span
                        initial={{ x: '-120%' }}
                        animate={{ x: '220%' }}
                        transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                        className="absolute inset-0 skew-x-12"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.span
                    key={uploading ? 'up' : 'idle'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18 }}
                  >
                    {uploading ? 'Archivage…' : "Publier l'exposition"}
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;