import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

import Entete_app from '../entete/Entete_app.jsx';
import CartePublication from './CartePublication.jsx';
import AperçuPublication from './AperçuPublication.jsx';
import BarreFiltres from './BarreFiltres.jsx';

const API_BASE = 'http://localhost:8000/api';

const CONFIG_THEME = {
  bg: '#2d3a30',
  bgCard: '#38483c',
  bgDeep: '#1f2922',
  accentSage: '#aec3b0',
  ivory: '#f8f9f8'
};

const Accueil = () => {
  const navigate = useNavigate();
  const [user, setUser]                     = useState(null);
  const [loading, setLoading]               = useState(true);
  const [errorConnexion, setErrorConnexion] = useState(false);

  const [publications, setPublications]     = useState([]);
  const [pubLoading, setPubLoading]         = useState(false);
  const [pagination, setPagination]         = useState(null);
  const [page, setPage]                     = useState(1);

  const [categories, setCategories]         = useState([]);
  const [filtreCat, setFiltreCat]           = useState('');
  const [filtreType, setFiltreType]         = useState('');
  const [rechercheInput, setRechercheInput] = useState('');
  const [recherche, setRecherche]           = useState('');

  const [likedMap, setLikedMap]             = useState({});
  const [focusedPub, setFocusedPub]         = useState(null);

  /* ── Authentification ── */
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/connexion'); return; }
    axios.get(`${API_BASE}/auth/moi/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data.success) setUser(r.data.data); else throw new Error(); })
      .catch(() => {
        setErrorConnexion(true);
        setTimeout(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/connexion');
        }, 2000);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  /* ── Récupération des Catégories ── */
  useEffect(() => {
    axios.get(`${API_BASE}/publications/categories/`)
      .then(r => { if (r.data.success) setCategories(r.data.data); })
      .catch(() => {});
  }, []);

  /* ── Requête Publications ── */
  const fetchPubs = useCallback(async (p = 1) => {
    setPubLoading(true);
    try {
      const params = new URLSearchParams({ page: p, page_size: 12 });
      if (filtreCat)  params.append('categorie', filtreCat);
      if (filtreType) params.append('type', filtreType);
      if (recherche)  params.append('q', recherche);
      const res = await axios.get(`${API_BASE}/publications/?${params}`);
      if (res.data.success) {
        let data = res.data.data;
        if (user?.role === 'photographe' && user?.id)
          data = data.filter(pub => pub.photographe_id !== user.id);
        setPublications(data);
        setPagination(res.data.pagination);
        const lm = {};
        data.forEach(pub => { lm[pub.id] = pub.a_like; });
        setLikedMap(prev => ({ ...prev, ...lm }));
      }
    } catch (e) { console.error(e); }
    finally { setPubLoading(false); }
  }, [filtreCat, filtreType, recherche, user]);

  useEffect(() => { if (user) fetchPubs(page); }, [user, page, filtreCat, filtreType, recherche, fetchPubs]);

  /* ── Système de Likes ── */
  const handleLike = async (pubId, e) => {
    e?.stopPropagation();
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const res = await axios.post(`${API_BASE}/publications/${pubId}/like/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLikedMap(prev => ({ ...prev, [pubId]: res.data.data.liked }));
        setPublications(prev => prev.map(p =>
          p.id === pubId ? { ...p, nombre_likes: res.data.data.nombre_likes } : p
        ));
        if (focusedPub?.id === pubId)
          setFocusedPub(prev => ({ ...prev, nombre_likes: res.data.data.nombre_likes }));
      }
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/connexion');
  };

  const resetFiltres = () => {
    setFiltreCat(''); setFiltreType(''); setRecherche(''); setRechercheInput(''); setPage(1);
  };

  if (loading) return (
    <div style={{ backgroundColor: CONFIG_THEME.bg }}
      className="w-screen h-screen flex flex-col items-center justify-center font-sans text-xs tracking-[0.5em] text-[#f8f9f8]"
    >
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        style={{ color: CONFIG_THEME.accentSage }}
        className="text-3xl mb-4 font-serif italic"
      >
        e.Sary
      </motion.div>
      CHARGEMENT DE LA COLLECTION...
    </div>
  );

  if (errorConnexion) return (
    <div style={{ backgroundColor: CONFIG_THEME.bg }}
      className="w-screen h-screen flex flex-col items-center justify-center font-sans text-center px-4"
    >
      <p className="text-red-300 text-xs tracking-[0.3em] uppercase mb-2 animate-pulse">Session expirée ou invalide</p>
      <p className="text-[#f8f9f8]/40 text-[10px] italic">Redirection vers l'espace de connexion...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: CONFIG_THEME.bg }} className="min-h-screen font-sans text-[#f8f9f8] selection:bg-[#aec3b0]/20 selection:text-white">
      <Entete_app user={user} onLogout={handleLogout} />

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto">
        
        {/* Barre des filtres extraite */}
        <BarreFiltres
          user={user}
          totalPublications={pagination?.total}
          rechercheInput={rechercheInput}
          setRechercheInput={setRechercheInput}
          onRechercheSubmit={() => { setRecherche(rechercheInput); setPage(1); }}
          filtreType={filtreType}
          setFiltreType={setFiltreType}
          filtreCat={filtreCat}
          setFiltreCat={setFiltreCat}
          categories={categories}
          onReset={resetFiltres}
          theme={CONFIG_THEME}
        />

        {/* Séparateur Linéaire */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-12 origin-left"
        />

        {/* Affichage conditionnel de la grille */}
        {pubLoading ? (
          <div className="flex justify-center items-center py-48">
            <div className="flex gap-3">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                  style={{ backgroundColor: CONFIG_THEME.accentSage }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
          </div>
        ) : publications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-48 gap-4"
          >
            <div className="w-[1px] h-16 bg-white/10" />
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase italic">
              Aucune publication disponible
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {publications.map((pub, idx) => (
                <CartePublication
                  key={pub.id}
                  pub={pub}
                  idx={idx}
                  liked={likedMap[pub.id] ?? pub.a_like}
                  onLike={handleLike}
                  onClick={() => setFocusedPub(pub)}
                  theme={CONFIG_THEME}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination de l'index */}
        {pagination && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-8 mt-20 border-t border-white/5 pt-8"
          >
            <button
              disabled={!pagination.precedente}
              onClick={() => setPage(p => p - 1)}
              className="px-6 py-3 rounded-2xl border border-white/10 text-white/40 text-[10px] tracking-[0.3em] uppercase hover:text-[#f8f9f8] hover:border-white/30 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            <span className="text-white/30 text-[10px] tracking-[0.4em] font-mono">
              {pagination.page_actuelle} <span style={{ color: CONFIG_THEME.accentSage }} className="opacity-50">/</span> {pagination.pages}
            </span>
            <button
              disabled={!pagination.suivante}
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-3 rounded-2xl border border-white/10 text-white/40 text-[10px] tracking-[0.3em] uppercase hover:text-[#f8f9f8] hover:border-white/30 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          </motion.div>
        )}
      </main>

      {/* Aperçu étendu en Lightbox */}
      <AnimatePresence>
        {focusedPub && (
          <AperçuPublication
            pub={focusedPub}
            liked={likedMap[focusedPub.id] ?? focusedPub.a_like}
            onLike={handleLike}
            onClose={() => setFocusedPub(null)}
            theme={CONFIG_THEME}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accueil;