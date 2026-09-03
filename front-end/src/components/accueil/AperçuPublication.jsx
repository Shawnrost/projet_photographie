import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AchatPopup from './AchatPopup';
import SectionCommentaires from './SectionCommentaires';

const AperçuPublication = ({ pub, liked, onLike, onClose, theme }) => {
  const [showAchat, setShowAchat] = useState(false);
  const [vueActive, setVueActive] = useState('details'); // 'details' | 'commentaires'
  const [totalCommentaires, setTotalCommentaires] = useState(null);

  useEffect(() => {
    const detecterEchap = e => { 
      if (e.key === 'Escape' && !showAchat) onClose(); 
    };
    window.addEventListener('keydown', detecterEchap);
    return () => window.removeEventListener('keydown', detecterEchap);
  }, [onClose, showAchat]);

  const handleOpenAchat = (e) => {
    e.stopPropagation();
    setShowAchat(true);
  };

  const handleCloseAchat = () => {
    setShowAchat(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-50 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
        style={{ backgroundColor: 'rgba(31, 41, 34, 0.85)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ backgroundColor: theme.bgDeep }}
          className="relative flex flex-col md:flex-row border border-white/10 rounded-[24px] overflow-hidden max-w-5xl w-full h-[85vh] shadow-2xl"
        >
          {/* Bouton de fermeture */}
          <button onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-black/40 transition-all text-xs"
          >
            ✕
          </button>

          {/* Section Cadre Photo */}
          <div className="md:w-[58%] bg-black/10 flex items-center justify-center overflow-hidden min-h-[220px] max-h-[42vh] md:max-h-none">
            <img 
              src={pub.image_affichee} 
              alt={pub.titre} 
              className="w-full h-full object-contain p-2" 
            />
          </div>

          {/* Section Index & Détails */}
          <div className="md:w-[42%] flex flex-col min-h-0 bg-black/[0.08]">

            {/* En-tête fixe : catégories, titre, onglets */}
            <div className="p-8 pb-5 flex flex-col gap-4 flex-shrink-0">
              {pub.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pub.categories.map(c => (
                    <span key={c.id}
                      style={{ color: theme.accentSage, borderColor: 'rgba(174, 195, 176, 0.25)' }}
                      className="text-[9px] tracking-[0.2em] uppercase border px-2.5 py-0.5 rounded-md font-mono"
                    >
                      {c.nom}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="text-white font-serif italic text-3xl font-light leading-tight tracking-tight">
                {pub.titre}
              </h2>

              <div style={{ backgroundColor: theme.accentSage }} className="h-[1px] w-12 opacity-30" />

              {/* Onglets Détails / Commentaires, en icônes */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setVueActive('details')}
                  title="Détails"
                  aria-label="Détails"
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    vueActive === 'details'
                      ? 'text-[#2d3a30] border-transparent shadow-sm'
                      : 'text-white/40 border-white/10 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                  style={vueActive === 'details' ? { backgroundColor: theme.accentSage } : undefined}
                >
                  <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4.5M12 8.5h.01" />
                  </svg>
                </button>

                <button
                  onClick={() => setVueActive('commentaires')}
                  title="Commentaires"
                  aria-label="Commentaires"
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    vueActive === 'commentaires'
                      ? 'text-[#2d3a30] border-transparent shadow-sm'
                      : 'text-white/40 border-white/10 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                  style={vueActive === 'commentaires' ? { backgroundColor: theme.accentSage } : undefined}
                >
                  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {totalCommentaires > 0 && (
                    <span
                      style={{ backgroundColor: theme.accentSage, borderColor: theme.bgDeep }}
                      className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full text-[8px] font-bold text-[#2d3a30] border-2"
                    >
                      {totalCommentaires > 9 ? '9+' : totalCommentaires}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Contenu scrollable indépendant : Détails ou Commentaires */}
            <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-5">
              <AnimatePresence mode="wait">
                {vueActive === 'details' ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5"
                  >
                    {pub.description && (
                      <p className="text-white/60 text-[13px] font-light leading-relaxed tracking-wide">
                        {pub.description}
                      </p>
                    )}

                    {pub.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {pub.tags.map(t => (
                          <span key={t.id} className="text-white/40 text-[10px] tracking-wide border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded-md">
                            #{t.nom}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Module d'Achat Intégré */}
                    {pub.type === 'vente' && (
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        {pub.est_vendue ? (
                          <span className="text-white/30 text-[9px] tracking-[0.25em] uppercase block text-center font-mono">
                            L'œuvre a rejoint une collection privée.
                          </span>
                        ) : (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                              <span className="text-white/40 text-[9px] tracking-widest uppercase mb-0.5">Tirage certifié</span>
                              <span style={{ color: theme.accentSage }} className="font-serif italic text-xl font-light">
                                {parseFloat(pub.prix).toFixed(2)} Ar
                              </span>
                            </div>
                            <button 
                              onClick={handleOpenAchat}
                              style={{ backgroundColor: theme.accentSage }} 
                              className="px-5 py-2.5 rounded-lg text-[#2d3a30] text-[9px] tracking-[0.25em] uppercase font-bold hover:bg-white hover:text-[#2d3a30] transition-all"
                            >
                              Acquérir
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="commentaires"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    <SectionCommentaires
                      pubId={pub.id}
                      theme={theme}
                      onTotalChange={setTotalCommentaires}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pied fixe des métadonnées créateur */}
            <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                {pub.photographe_photo ? (
                  <img 
                    src={pub.photographe_photo} 
                    alt={pub.photographe_nom} 
                    className="w-8 h-8 rounded-full object-cover border border-white/10" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <span className="text-white text-xs font-light">{pub.photographe_nom?.[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-white/80 text-sm font-medium tracking-wide leading-none">{pub.photographe_nom}</p>
                  <p style={{ color: theme.accentSage }} className="text-[8px] tracking-[0.3em] uppercase mt-1 font-mono">Auteur de l'œuvre</p>
                </div>
              </div>

              <button 
                onClick={(e) => onLike(pub.id, e)} 
                className="flex items-center gap-2 group/like transition-all hover:scale-105"
              >
                <motion.span
                  key={liked ? 'l' : 'u'}
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }}
                  style={{ color: liked ? theme.accentSage : 'inherit' }}
                  className={`text-base transition-colors ${!liked && 'text-white/30 group-hover/like:text-white/50'}`}
                >
                  {liked ? '♥' : '♡'}
                </motion.span>
                <span className="text-xs font-mono tabular-nums text-white/50">
                  {pub.nombre_likes}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Popup d'achat */}
      {showAchat && (
        <AchatPopup
          pub={pub}
          onClose={handleCloseAchat}
          theme={theme}
        />
      )}
    </>
  );
};

export default AperçuPublication;
