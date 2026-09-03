// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\accueil\SectionCommentaires.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

const SectionCommentaires = ({ pubId, theme, onTotalChange }) => {
  const navigate = useNavigate();
  const estConnecte = !!localStorage.getItem('access_token');

  const [commentaires, setCommentaires]   = useState([]);
  const [pagination, setPagination]       = useState(null);
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(true);
  const [chargementPlus, setChargementPlus] = useState(false);
  const [erreur, setErreur]               = useState(null);

  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [envoiEnCours, setEnvoiEnCours]     = useState(false);
  const commentTextareaRef = useRef(null);

  const [replyOuvert, setReplyOuvert]       = useState(null);
  const [texteReponse, setTexteReponse]     = useState('');
  const [envoiReponseEnCours, setEnvoiReponseEnCours] = useState(false);

  const [suppressionEnCours, setSuppressionEnCours] = useState(null);
  const [likesEnCours, setLikesEnCours]     = useState({});
  const [likedMap, setLikedMap]             = useState({});
  const [nombreLikesMap, setNombreLikesMap] = useState({});

  const fetchCommentaires = useCallback(async (p) => {
    if (p === 1) setLoading(true); else setChargementPlus(true);
    setErreur(null);
    try {
      const res = await api.get(`/publications/${pubId}/commentaires/?page=${p}&page_size=12`);
      if (res.data.success) {
        const nouveaux = res.data.data;
        setCommentaires(prev => (p === 1 ? nouveaux : [...prev, ...nouveaux]));
        setPagination(res.data.pagination);
        setPage(p);
        if (p === 1 && onTotalChange) onTotalChange(res.data.pagination?.total ?? nouveaux.length);
      }
    } catch (e) {
      console.error('Erreur chargement commentaires:', e);
      setErreur("Impossible de charger les commentaires.");
    } finally {
      setLoading(false);
      setChargementPlus(false);
    }
  }, [pubId, onTotalChange]);

  useEffect(() => {
    fetchCommentaires(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubId]);

  const handleChargerPlus = () => {
    if (pagination?.suivante && !chargementPlus) fetchCommentaires(page + 1);
  };

  const majTotal = (delta) => {
    if (!onTotalChange) return;
    setPagination(prev => {
      const nouveauTotal = Math.max(0, (prev?.total ?? 0) + delta);
      onTotalChange(nouveauTotal);
      return prev ? { ...prev, total: nouveauTotal } : prev;
    });
  };

  const handlePosterCommentaire = async (e) => {
    e.preventDefault();
    if (!nouveauCommentaire.trim()) return;
    if (!estConnecte) { navigate('/connexion'); return; }

    setEnvoiEnCours(true);
    try {
      const res = await api.post(`/publications/${pubId}/commentaires/`, {
        contenu: nouveauCommentaire.trim()
      });
      if (res.data.success) {
        setCommentaires(prev => [res.data.data, ...prev]);
        setNouveauCommentaire('');
        if (commentTextareaRef.current) commentTextareaRef.current.style.height = 'auto';
        majTotal(1);
      }
    } catch (err) {
      console.error('Erreur envoi commentaire:', err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi du commentaire.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const handlePosterReponse = async (parentId) => {
    if (!texteReponse.trim()) return;
    if (!estConnecte) { navigate('/connexion'); return; }

    setEnvoiReponseEnCours(true);
    try {
      const res = await api.post(`/publications/${pubId}/commentaires/`, {
        contenu: texteReponse.trim(),
        parent_id: parentId
      });
      if (res.data.success) {
        setCommentaires(prev => prev.map(c => (
          c.id === parentId
            ? { ...c, reponses: [...(c.reponses || []), res.data.data], nombre_reponses: (c.nombre_reponses || 0) + 1 }
            : c
        )));
        setTexteReponse('');
        setReplyOuvert(null);
      }
    } catch (err) {
      console.error('Erreur envoi réponse:', err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi de la réponse.");
    } finally {
      setEnvoiReponseEnCours(false);
    }
  };

  const handleSupprimerCommentaire = async (commentaire) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    setSuppressionEnCours(commentaire.id);
    try {
      const res = await api.delete(`/publications/commentaires/${commentaire.id}/`);
      if (res.data.success) {
        setCommentaires(prev => prev.filter(c => c.id !== commentaire.id));
        majTotal(-(1 + (commentaire.nombre_reponses || 0)));
      }
    } catch (err) {
      console.error('Erreur suppression commentaire:', err);
      alert(err.response?.data?.message || "Impossible de supprimer ce commentaire.");
    } finally {
      setSuppressionEnCours(null);
    }
  };

  const handleLikeCommentaire = async (commentaireId) => {
    if (!estConnecte) { navigate('/connexion'); return; }
    if (likesEnCours[commentaireId]) return;

    setLikesEnCours(prev => ({ ...prev, [commentaireId]: true }));
    try {
      const res = await api.post(`/publications/commentaires/${commentaireId}/like/`);
      if (res.data.success) {
        const { liked, nombre_likes } = res.data.data;
        setLikedMap(prev => ({ ...prev, [commentaireId]: liked }));
        setNombreLikesMap(prev => ({ ...prev, [commentaireId]: nombre_likes }));
      }
    } catch (err) {
      console.error('Erreur like commentaire:', err);
    } finally {
      setLikesEnCours(prev => ({ ...prev, [commentaireId]: false }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Formulaire nouveau commentaire */}
      <form onSubmit={handlePosterCommentaire} className="flex gap-2 mb-7 flex-shrink-0 items-end">
        <textarea
          ref={commentTextareaRef}
          value={nouveauCommentaire}
          onChange={(e) => {
            setNouveauCommentaire(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
          }}
          onFocus={() => { if (!estConnecte) navigate('/connexion'); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handlePosterCommentaire(e);
            }
          }}
          placeholder={estConnecte ? 'Ajouter un commentaire...' : 'Connectez-vous pour commenter'}
          rows={1}
          className="flex-1 bg-white/[0.04] border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-white/25 transition-colors resize-none overflow-y-auto max-h-32 leading-relaxed"
        />
        <button
          type="submit"
          disabled={envoiEnCours || !nouveauCommentaire.trim()}
          style={{ backgroundColor: theme.accentSage }}
          className="px-5 py-3 rounded-xl text-[#2d3a30] text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {envoiEnCours ? '...' : 'Publier'}
        </button>
      </form>

      {/* États de chargement / erreur / vide */}
      {loading && commentaires.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                style={{ backgroundColor: theme.accentSage }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>
        </div>
      ) : erreur ? (
        <p className="text-red-300/70 text-sm text-center py-14">{erreur}</p>
      ) : commentaires.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-14 opacity-60">
          <svg className="w-7 h-7 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase italic text-center">
            Aucun commentaire pour l'instant.
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          <AnimatePresence initial={false}>
            {commentaires.map((commentaire) => (
              <motion.div
                key={commentaire.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3.5"
              >
                {commentaire.auteur_photo ? (
                  <img
                    src={commentaire.auteur_photo}
                    alt={commentaire.auteur_nom}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 flex-shrink-0">
                    <span className="text-white text-sm font-light">{commentaire.auteur_nom?.[0]}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white/80 text-[13px] font-medium tracking-wide truncate">{commentaire.auteur_nom}</p>
                    <span className="text-white/25 text-[10px] font-mono shrink-0">{formatDate(commentaire.created_at)}</span>
                  </div>
                  <p className="text-white/60 text-sm font-light leading-relaxed mt-1.5 whitespace-pre-wrap">
                    {commentaire.contenu}
                  </p>

                  <div className="flex items-center gap-5 mt-2.5">
                    <button
                      onClick={() => handleLikeCommentaire(commentaire.id)}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 hover:text-white/70 transition-colors"
                    >
                      <span className="text-sm" style={{ color: likedMap[commentaire.id] ? theme.accentSage : undefined }}>
                        {likedMap[commentaire.id] ? '♥' : '♡'}
                      </span>
                      {(nombreLikesMap[commentaire.id] ?? commentaire.nombre_likes ?? 0) > 0 &&
                        (nombreLikesMap[commentaire.id] ?? commentaire.nombre_likes)}
                    </button>

                    <button
                      onClick={() => { setReplyOuvert(replyOuvert === commentaire.id ? null : commentaire.id); setTexteReponse(''); }}
                      className="text-[10px] font-mono text-white/40 hover:text-white/70 uppercase tracking-wider transition-colors"
                    >
                      Répondre
                    </button>

                    {commentaire.est_auteur && (
                      <button
                        onClick={() => handleSupprimerCommentaire(commentaire)}
                        disabled={suppressionEnCours === commentaire.id}
                        title="Supprimer"
                        aria-label="Supprimer le commentaire"
                        className="text-red-400/50 hover:text-red-400 transition-colors disabled:opacity-30"
                      >
                        {suppressionEnCours === commentaire.id ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m3 0l-.75 12.5A2 2 0 0115.26 21H8.74a2 2 0 01-1.99-1.5L6 7m4 4v6m4-6v6" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Formulaire de réponse */}
                  <AnimatePresence>
                    {replyOuvert === commentaire.id && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={(e) => { e.preventDefault(); handlePosterReponse(commentaire.id); }}
                        className="flex gap-2 mt-2 overflow-hidden items-end"
                      >
                        <textarea
                          autoFocus
                          value={texteReponse}
                          onChange={(e) => {
                            setTexteReponse(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                              e.preventDefault();
                              handlePosterReponse(commentaire.id);
                            }
                          }}
                          placeholder={`Répondre à ${commentaire.auteur_nom}...`}
                          rows={1}
                          className="flex-1 bg-white/[0.04] border border-white/10 focus:border-white/30 rounded-lg px-3 py-2 text-xs text-white outline-none placeholder-white/25 resize-none overflow-y-auto max-h-24 leading-relaxed"
                        />
                        <button
                          type="submit"
                          disabled={envoiReponseEnCours || !texteReponse.trim()}
                          style={{ backgroundColor: theme.accentSage }}
                          className="px-3 py-2 rounded-lg text-[#2d3a30] text-[10px] font-bold uppercase disabled:opacity-40"
                        >
                          {envoiReponseEnCours ? '...' : 'Envoyer'}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Réponses */}
                  {commentaire.reponses?.length > 0 && (
                    <div className="mt-4 space-y-4 pl-5 border-l border-white/10">
                      {commentaire.reponses.map((reponse) => (
                        <div key={reponse.id} className="flex items-start gap-3">
                          {reponse.auteur_photo ? (
                            <img
                              src={reponse.auteur_photo}
                              alt={reponse.auteur_nom}
                              className="w-7 h-7 rounded-full object-cover border border-white/10 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center bg-white/5 flex-shrink-0">
                              <span className="text-white text-[11px] font-light">{reponse.auteur_nom?.[0]}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-white/70 text-xs font-medium tracking-wide truncate">{reponse.auteur_nom}</p>
                              <span className="text-white/20 text-[9px] font-mono shrink-0">{formatDate(reponse.created_at)}</span>
                            </div>
                            <p className="text-white/50 text-[13px] font-light leading-relaxed mt-1 whitespace-pre-wrap">
                              {reponse.contenu}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pagination?.suivante && (
            <button
              onClick={handleChargerPlus}
              disabled={chargementPlus}
              className="w-full text-center text-[10px] font-mono uppercase tracking-wider text-white/40 hover:text-white/70 py-2 transition-colors disabled:opacity-40"
            >
              {chargementPlus ? 'Chargement...' : 'Charger plus de commentaires'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionCommentaires;