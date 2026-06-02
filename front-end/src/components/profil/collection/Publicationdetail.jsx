// src/components/profil/collection/PublicationDetail.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const PublicationDetail = ({ pub, onClose, onDelete, onEdit }) => {
  if (!pub) return null;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const tags = pub.tags || [];
  const categories = pub.categories || [];
  const dateFormatee = pub.created_at
    ? new Date(pub.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const handleDelete = async () => {
    setDeleting(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:8000/api/publications/${pub.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.dispatchEvent(new CustomEvent('trigger-island-notification', {
        detail: { message: "Publication supprimée de votre atelier.", type: 'success' }
      }));
      onDelete?.(pub.id);
      onClose?.();
    } catch {
      window.dispatchEvent(new CustomEvent('trigger-island-notification', {
        detail: { message: "Erreur lors de la suppression.", type: 'error' }
      }));
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const rise = (i) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent pt-2">

      {/* ── CORPS CENTRAL SCROLLABLE ── */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-24" style={{ scrollbarWidth: 'none' }}>

        {/* ── IMAGE HERO MODERNISÉE ── */}
        <motion.div 
          {...rise(0)} 
          className="relative w-full rounded-2xl overflow-hidden shrink-0 shadow-sm border border-[#2d3a30]/5 bg-[#2d3a30]/5" 
          style={{ aspectRatio: '16/10' }}
        >
          <img 
            src={pub.image_affichee} 
            alt={pub.titre} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-0.5 rounded-full font-sans text-[9px] font-medium tracking-wider uppercase backdrop-blur-md border ${
              pub.type === 'vente'
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'bg-white/60 text-[#2d3a30] border-white/40'
            }`}>
              {pub.type === 'vente' ? '✨ Série limitée' : '👁️ Exposition'}
            </span>
          </div>

          <div className="absolute bottom-3 left-3">
            <p className="font-sans text-[9px] font-medium tracking-widest text-white/80 uppercase">
              {dateFormatee}
            </p>
          </div>
        </motion.div>

        {/* ── TITRE (FORCÉ EN FONT-SANS SANS STYLES INLINE BIZARRES) ── */}
        <motion.div {...rise(1)} className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#2d3a30] font-sans">
            {pub.titre}
          </h2>
          <div className="flex items-center gap-2 text-[#2d3a30]/40">
            <span className="w-1 h-1 rounded-full bg-[#2d3a30]/30" />
            <span className="font-sans text-[9px] font-semibold tracking-widest uppercase">
              {pub.type === 'vente' ? 'Édition Commerciale' : 'Accès Libre'}
            </span>
          </div>
        </motion.div>

        {/* ── RÉCIT ARTISTIQUE (FINI LE LOOK TRADITIONNEL) ── */}
        {pub.description && (
          <motion.div {...rise(2)} className="bg-white/60 backdrop-blur-md border border-[#2d3a30]/5 rounded-xl p-4 shadow-xs">
            <p className="font-sans text-[8px] font-bold tracking-widest text-[#2d3a30]/40 uppercase mb-2 flex items-center gap-1.5">
              <span className="w-1 h-2.5 bg-[#2d3a30]/30 rounded-full inline-block" />
              Note d'intention
            </p>
            <p className="text-[13px] text-[#2d3a30]/80 font-sans leading-relaxed">
              {pub.description}
            </p>
          </motion.div>
        )}

        {/* ── GRILLE DES INFOS / GLASSMORPHISM ── */}
        <motion.div {...rise(3)} className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 backdrop-blur-md border border-[#2d3a30]/5 rounded-xl p-3.5 flex flex-col justify-between">
            <p className="font-sans text-[8px] font-bold tracking-widest text-[#2d3a30]/40 uppercase">Destination</p>
            <p className="font-sans text-xs font-semibold text-[#2d3a30]/80 mt-1">
              {pub.type === 'vente' ? `${parseFloat(pub.prix).toLocaleString('fr-FR')} MGA` : 'Exposition gratuite'}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-[#2d3a30]/5 rounded-xl p-3.5 flex flex-col justify-between">
            <p className="font-sans text-[8px] font-bold tracking-widest text-[#2d3a30]/40 uppercase">Vues</p>
            <p className="font-sans text-xs font-bold text-[#2d3a30]/80 mt-1">
              {pub.nb_vues ?? 0} <span className="text-[9px] font-normal text-[#2d3a30]/40">visites</span>
            </p>
          </div>
        </motion.div>

        {/* ── TAXONOMIE (CATÉGORIES & TAGS) ── */}
        <div className="space-y-3">
          {categories.length > 0 && (
            <motion.div {...rise(4)} className="flex flex-wrap gap-1">
              {categories.map((cat, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-[#2d3a30]/5 rounded-md font-sans text-[10px] font-medium text-[#2d3a30]/70 border border-[#2d3a30]/5">
                  {cat.nom || cat}
                </span>
              ))}
            </motion.div>
          )}

          {tags.length > 0 && (
            <motion.div {...rise(5)} className="flex flex-wrap gap-1">
              {tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 font-sans text-[10px] text-[#2d3a30]/40 bg-white/30 rounded-md border border-[#2d3a30]/5">
                  #{tag.nom || tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>

      </div>

      {/* ── ZONE BOUTONS FIXE EN BAS (PLUS DE SOUCI DE DEBORDEMENT) ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent pt-6 pb-4 px-1 flex gap-3 border-t border-[#2d3a30]/5">
        
        {/* BOUTON MODIFIER */}
        <motion.button
          onClick={() => onEdit?.(pub)}
          whileHover={{ scale: 1.01, backgroundColor: '#2d3a30', color: '#ffffff' }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#2d3a30]/10 rounded-xl font-sans text-[10px] font-bold tracking-wider uppercase text-[#2d3a30]/70 transition-all duration-200 shadow-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Modifier
        </motion.button>

        {/* BOUTON SUPPRIMER AVEC SÉCURITÉ INLINE */}
        <div className="flex-1 flex overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            {!confirmDelete ? (
              <motion.button
                key="ask"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmDelete(true)}
                whileHover={{ scale: 1.01, backgroundColor: '#fef2f2', borderColor: '#fee2e2' }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-red-100 rounded-xl font-sans text-[10px] font-bold tracking-wider uppercase text-red-500 transition-all duration-200 shadow-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a1 1 0 001 1h3m-10 0h3m0 0V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                </svg>
                Supprimer
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="w-full flex items-center gap-2"
              >
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-sans text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  {deleting ? '...' : 'OUI'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 bg-white border border-[#2d3a30]/10 rounded-xl font-sans text-[9px] font-bold tracking-wider uppercase text-[#2d3a30]/50 transition-colors hover:bg-[#2d3a30]/5 cursor-pointer"
                >
                  NON
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default PublicationDetail;