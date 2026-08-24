// src/components/profil/collection/Collection.jsx
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import PublicationCard from './PublicationCard';
import PublicationDetail from './PublicationDetail';
import UploadModal from './UploadModal';

const Collection = () => {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPub, setSelectedPub] = useState(null);

  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    titre: '', description: '', type: 'publicite',
    prix: '', categorieId: '', tagsString: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const [pubRes, catRes, subRes] = await Promise.all([
        axios.get('http://localhost:8000/api/publications/mes-publications/', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/publications/categories/'),
        axios.get('http://localhost:8000/api/abonnements/statut/', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      if (pubRes.data.success) setPublications(pubRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (subRes.data.success) {
        setHasActiveSubscription(subRes.data.data.a_abonnement_actif);
        setSubscriptionDetails(subRes.data.data.abonnement);
      }
    } catch {
      window.dispatchEvent(new CustomEvent('trigger-island-notification', {
        detail: { message: "Erreur lors de la synchronisation de l'atelier.", type: 'error' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews(prev => [...prev, { id: Math.random().toString(), url: reader.result, name: file.name }]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id, index) => {
    setPreviews(prev => prev.filter(item => item.id !== id));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === 'vente' && !hasActiveSubscription) {
      window.dispatchEvent(new CustomEvent('trigger-island-notification', {
        detail: { message: "Abonnement requis pour vendre vos séries limitées.", type: 'error' }
      }));
      return;
    }
    if (!selectedFiles.length) {
      window.dispatchEvent(new CustomEvent('trigger-island-notification', {
        detail: { message: "Une photographie originale est requise.", type: 'error' }
      }));
      return;
    }
    if (formData.type === 'vente' && !formData.prix) {
      window.dispatchEvent(new CustomEvent('trigger-island-notification', {
        detail: { message: "Le prix est obligatoire pour les séries limitées.", type: 'error' }
      }));
      return;
    }
    setUploading(true);
    const token = localStorage.getItem('access_token');
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('type', formData.type);
    if (formData.type === 'vente') data.append('prix', formData.prix);
    if (formData.categorieId?.trim()) data.append('categories', formData.categorieId);
    if (selectedFiles.length) data.append('image_originale', selectedFiles[0]);
    if (formData.tagsString.trim())
      formData.tagsString.split(',').map(t => t.trim()).filter(Boolean).forEach(tag => data.append('tags', tag));
    try {
      const response = await axios.post('http://localhost:8000/api/publications/', data, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setShowUploadModal(false);
        setSelectedFiles([]);
        setPreviews([]);
        setFormData({ titre: '', description: '', type: 'publicite', prix: '', categorieId: '', tagsString: '' });
        window.dispatchEvent(new CustomEvent('trigger-island-notification', {
          detail: { message: "L'œuvre a été archivée et publiée avec succès.", type: 'success' }
        }));
        fetchData();
      }
    } catch (error) {
      const backendErrors = error.response?.data?.errors || error.response?.data;
      let msg = "Une erreur est survenue.";
      if (backendErrors && typeof backendErrors === 'object')
        msg = Object.entries(backendErrors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
      else if (typeof backendErrors === 'string') msg = backendErrors;
      window.dispatchEvent(new CustomEvent('trigger-island-notification', { detail: { message: msg, type: 'error' } }));
    } finally {
      setUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
  };

  const modal = (
    <UploadModal
      isOpen={showUploadModal}
      onClose={() => setShowUploadModal(false)}
      uploading={uploading}
      onSubmit={handleUploadSubmit}
      categories={categories}
      hasActiveSubscription={hasActiveSubscription}
      formData={formData}
      setFormData={setFormData}
      previews={previews}
      fileInputRef={fileInputRef}
      onPhotoClick={handlePhotoClick}
      onFileChange={handleFileChange}
      onRemoveImage={removeImage}
    />
  );

  return (
    <div className="w-full h-full overflow-hidden flex flex-col bg-transparent">
      <AnimatePresence mode="wait">

        {/* ── VUE DÉTAIL ── */}
        {selectedPub ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Bouton Retour iOS Minimaliste */}
            <motion.button
              onClick={() => setSelectedPub(null)}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest text-[#2d3a30]/40 uppercase hover:text-[#2d3a30]/80 transition-colors mb-6 w-fit cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Retour à la collection
            </motion.button>

            <div className="flex-1 overflow-hidden relative">
              <PublicationDetail
                pub={selectedPub}
                onClose={() => setSelectedPub(null)}
                onDelete={(id) => {
                  setPublications(prev => prev.filter(p => p.id !== id));
                  setSelectedPub(null);
                }}
                onEdit={(pub) => {
                  setSelectedPub(null);
                  setShowUploadModal(true);
                }}
              />
            </div>
          </motion.div>

        ) : (

          /* ── VUE GRILLE ── */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {loading ? (
              <div className="flex-1 flex items-center justify-center font-sans text-[10px] font-bold text-[#2d3a30]/30 uppercase tracking-widest animate-pulse py-20">
                Mise au point de la galerie...
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start pb-12"
              >
                {/* Card "Nouvelle création" */}
                <motion.div
                  variants={itemVariants}
                  onClick={() => setShowUploadModal(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative rounded-2xl border border-dashed border-[#2d3a30]/15 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center gap-3.5 cursor-pointer transition-all duration-300 hover:border-[#2d3a30]/30 hover:bg-white shadow-xs"
                  style={{ minHeight: 220 }}
                >
                  {hasActiveSubscription && subscriptionDetails && (
                    <span className="absolute top-4 left-4 font-sans text-[8px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✦ {subscriptionDetails.type}
                    </span>
                  )}

                  <div className="w-11 h-11 rounded-full bg-[#2d3a30]/5 border border-[#2d3a30]/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-90">
                    <svg className="w-4 h-4 text-[#2d3a30]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="font-sans font-medium text-[13.5px] text-[#2d3a30]/70 mb-0.5">
                      Nouvelle création
                    </p>
                    <p className="font-sans text-[9px] font-bold tracking-widest text-[#2d3a30]/30 uppercase">
                      {publications.length} œuvre{publications.length > 1 ? 's' : ''} archivée{publications.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </motion.div>

                {/* Cartes réelles */}
                {publications.map((pub) => (
                  <PublicationCard
                    key={pub.id}
                    pub={pub}
                    variants={itemVariants}
                    onClick={setSelectedPub}
                    isSelected={selectedPub?.id === pub.id}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {createPortal(modal, document.body)}
    </div>
  );
};

export default Collection;