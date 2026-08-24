// src/components/recherche/PopupUtilisateur.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const PopupUtilisateur = ({ userData, userId, onClose, theme }) => {
  const [user, setUser] = useState(userData || null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(!userData);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(userData?.est_suivi || false);
  const [followersCount, setFollowersCount] = useState(userData?.nombre_abonnes || 0);
  const [publicationsLoading, setPublicationsLoading] = useState(false);

  const id = userId || userData?.id;

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsFollowing(userData.est_suivi || false);
      setFollowersCount(userData.nombre_abonnes || 0);
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    const fetchPublications = async () => {
      if (!id) return;
      
      // Vérifier si l'utilisateur est un photographe
      if (userData && userData.role !== 'photographe') {
        setPublications([]);
        return;
      }
      
      setPublicationsLoading(true);
      
      try {
        // IMPORTANT: Utiliser l'ID du profil photographe si disponible
        // Sinon, utiliser l'ID de l'utilisateur
        const photographeId = userData?.profil_photographe?.id || id;
        
        console.log('🔍 Récupération des publications pour le photographe:', photographeId);
        console.log('📋 userData complet:', userData);
        console.log('📋 profil_photographe:', userData?.profil_photographe);
        
        const response = await api.get('/publications/', {
          params: {
            photographe: photographeId,
            page: 1,
            page_size: 20
          }
        });
        
        console.log('📦 Réponse API:', response.data);
        
        if (response.data && response.data.success) {
          const publicationsData = response.data.data || [];
          console.log(`📸 ${publicationsData.length} publications trouvées`);
          setPublications(publicationsData);
        } else {
          setPublications([]);
        }
      } catch (pubErr) {
        console.error('❌ Erreur:', pubErr);
        setPublications([]);
      } finally {
        setPublicationsLoading(false);
      }
    };

    if (userData) {
      fetchPublications();
    }
  }, [id, userData]);

  const handleFollow = async () => {
    try {
      const response = await api.post(`/abonnements/suivre/${id}/`);
      
      if (response.data.success) {
        setIsFollowing(response.data.data.suivi);
        setFollowersCount(response.data.data.nombre_abonnes);
      }
    } catch (err) {
      console.error('Erreur follow:', err);
    }
  };

  const getInitiales = () => {
    if (!user) return '?';
    if (user.prenom && user.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    if (user.prenom) {
      return user.prenom.substring(0, 2).toUpperCase();
    }
    if (user.nom) {
      return user.nom.substring(0, 2).toUpperCase();
    }
    return user.username?.substring(0, 2).toUpperCase() || '?';
  };

  const getRoleLabel = (role) => {
    const roles = {
      photographe: 'Photographe',
      client: 'Client',
      admin: 'Administrateur'
    };
    return roles[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <PopupContainer onClose={onClose}>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-[#aec3b0]/20 border-t-[#aec3b0] animate-spin" />
          <p className="mt-4 text-white/40 text-xs font-mono tracking-widest uppercase">
            Chargement...
          </p>
        </div>
      </PopupContainer>
    );
  }

  if (error || !user) {
    return (
      <PopupContainer onClose={onClose}>
        <div className="flex flex-col items-center justify-center h-64">
          <span className="text-3xl text-red-400/40 mb-3">⚠</span>
          <p className="text-white/60 text-sm font-serif italic">
            {error || 'Utilisateur non trouvé'}
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 text-xs font-mono tracking-wider uppercase text-white/40 hover:text-white/80 transition-colors border border-white/10 rounded-xl hover:border-white/20"
          >
            Fermer
          </button>
        </div>
      </PopupContainer>
    );
  }

  const isPhotographe = user.role === 'photographe';

  return (
    <PopupContainer onClose={onClose}>
      {/* En-tête du profil */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          {user.photo_profil ? (
            <img 
              src={user.photo_profil} 
              alt={`${user.prenom} ${user.nom}`}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#aec3b0]/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2d3a30]/40 to-[#1f2922]/40 flex items-center justify-center border border-white/10 ring-2 ring-[#aec3b0]/20">
              <span className="text-[#aec3b0] font-serif text-xl font-light">
                {getInitiales()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-serif text-xl text-white">
              {user.prenom} {user.nom}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/50 font-mono text-[8px] tracking-wider uppercase border border-white/5">
              {getRoleLabel(user.role)}
            </span>
          </div>
          
          <p className="text-white/40 text-xs font-mono tracking-wider mt-0.5">
            @{user.username || 'utilisateur'}
          </p>
          
          {user.bio && (
            <p className="text-white/60 text-sm mt-2 italic leading-relaxed line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        <button
          onClick={handleFollow}
          className={`flex-shrink-0 px-4 py-2 rounded-xl font-mono text-[9px] tracking-wider uppercase transition-all duration-300 ${
            isFollowing
              ? 'bg-[#aec3b0]/20 text-[#aec3b0] border border-[#aec3b0]/30 hover:bg-[#aec3b0]/30'
              : 'bg-[#aec3b0] text-[#1f2922] hover:bg-[#c5d6c9] shadow-lg shadow-[#aec3b0]/20'
          }`}
        >
          {isFollowing ? '✓ Suivi' : 'Suivre'}
        </button>
      </div>

      {/* Statistiques */}
      <div className="flex items-center gap-6 mb-6 pb-4 border-b border-white/5">
        <div className="text-center">
          <span className="block text-white text-sm font-medium">
            {followersCount}
          </span>
          <span className="text-white/30 text-[8px] font-mono uppercase tracking-wider">
            Abonnés
          </span>
        </div>
        {isPhotographe && (
          <div className="text-center">
            <span className="block text-white text-sm font-medium">
              {user.nombre_abonnements || 0}
            </span>
            <span className="text-white/30 text-[8px] font-mono uppercase tracking-wider">
              Abonnements
            </span>
          </div>
        )}
        <div className="text-center">
          <span className="block text-white text-sm font-medium">
            {publications.length}
          </span>
          <span className="text-white/30 text-[8px] font-mono uppercase tracking-wider">
            Œuvres
          </span>
        </div>
        {user.created_at && (
          <div className="text-center ml-auto">
            <span className="text-white/20 text-[7px] font-mono uppercase tracking-wider">
              Membre depuis
            </span>
            <span className="block text-white/40 text-[10px] font-mono">
              {formatDate(user.created_at)}
            </span>
          </div>
        )}
      </div>

      {/* Publications */}
      {isPhotographe && (
        <div>
          <h3 className="font-mono text-[8px] tracking-[0.3em] text-white/30 uppercase mb-4">
            Ses œuvres ({publications.length})
          </h3>
          
          {publicationsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-[#aec3b0]/20 border-t-[#aec3b0] animate-spin" />
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                </svg>
              </div>
              <p className="text-white/30 text-sm font-serif italic">
                Aucune œuvre publiée
              </p>
              <p className="text-white/10 text-[8px] font-mono mt-2 tracking-wider">
                Ce photographe n'a pas encore partagé de créations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {publications.map((pub) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-[#1f2922] border border-white/5 hover:border-[#aec3b0]/30 transition-all duration-300"
                >
                  {pub.image_affichee ? (
                    <img 
                      src={pub.image_affichee} 
                      alt={pub.titre || 'Œuvre'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                      </svg>
                    </div>
                  )}
                  
                  {pub.type && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[6px] font-mono uppercase tracking-wider border ${
                      pub.type === 'vente' 
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {pub.type === 'vente' ? '💰 Vente' : '📢 Publicité'}
                    </span>
                  )}
                  
                  {pub.est_vendue && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[6px] font-mono uppercase tracking-wider">
                      ✓ Vendue
                    </span>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-2">
                      {pub.titre && (
                        <p className="text-white text-xs font-serif italic line-clamp-2">
                          {pub.titre}
                        </p>
                      )}
                      {pub.prix && pub.type === 'vente' && (
                        <p className="text-amber-400 text-xs font-mono mt-1">
                          {Number(pub.prix).toLocaleString('fr-FR')} MGA
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3 mt-1 text-white/60">
                        <span className="text-[8px] font-mono flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                          </svg>
                          {pub.nombre_likes || 0}
                        </span>
                        {pub.categories && pub.categories.length > 0 && (
                          <span className="text-[7px] font-mono text-white/40">
                            {pub.categories[0].nom}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {isPhotographe && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400/50 animate-pulse" />
            <span className="text-white/30 text-[7px] font-mono uppercase tracking-widest">
              Photographe
            </span>
          </div>
          <span className="text-white/20 text-[7px] font-mono tracking-wider">
            {publications.length} œuvres publiées
          </span>
        </div>
      )}
    </PopupContainer>
  );
};

// PopupContainer
const PopupContainer = ({ children, onClose }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1f2922] text-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 border border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/30 hover:text-white/70 transition w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/10 flex items-center justify-center z-10"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#aec3b0]/5 rounded-full blur-3xl pointer-events-none" />

          {children}
        </div>
      </motion.div>
    </>
  );
};

export default PopupUtilisateur;