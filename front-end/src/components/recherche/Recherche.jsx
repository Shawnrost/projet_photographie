import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import PanneauRecherche from './PanneauRecherche';
import ResultatsGrille from './ResultatsGrille';
import AperçuPublication from '../accueil/AperçuPublication';
import { rechercheUtilisateurs, getPublications } from '../../services/api';

const SUGGESTED_TAGS = ["Tous", "photographe", "client"];

const Recherche = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("Tous");
  const [userResults, setUserResults] = useState([]);
  const [publicationResults, setPublicationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [publicationsPagination, setPublicationsPagination] = useState(null);
  const [focusedPub, setFocusedPub] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  const isSearchActive = searchQuery.trim() !== "" || selectedTag !== "Tous";

  // Recherche d'utilisateurs via l'API
  const fetchUsers = useCallback(async (page = 1) => {
    const query = searchQuery.trim();
    
    if (query.length < 2 && selectedTag === "Tous") {
      setUserResults([]);
      setPagination(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = { 
        q: query || '',
        page: page,
        page_size: 12
      };
      
      if (selectedTag !== "Tous") {
        params.role = selectedTag;
      }
      
      const response = await rechercheUtilisateurs(params);
      
      const responseData = response.data.data || response.data;
      setUserResults(Array.isArray(responseData) ? responseData : []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error('Erreur recherche utilisateurs:', err);
      setError(err.response?.data?.message || 'Erreur lors de la recherche');
      setUserResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTag]);

  // Recherche de publications via l'API
  const fetchPublications = useCallback(async (page = 1) => {
    const query = searchQuery.trim();
    
    if (query.length < 2 && selectedTag === "Tous") {
      setPublicationResults([]);
      setPublicationsPagination(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = { 
        page: page,
        page_size: 12
      };
      
      if (query) params.q = query;
      
      const response = await getPublications(params);
      
      const responseData = response.data.data || response.data;
      setPublicationResults(Array.isArray(responseData) ? responseData : []);
      setPublicationsPagination(response.data.pagination || null);
      
      // Mettre à jour le likedMap
      if (Array.isArray(responseData)) {
        const lm = {};
        responseData.forEach(pub => { lm[pub.id] = pub.a_like; });
        setLikedMap(prev => ({ ...prev, ...lm }));
      }
    } catch (err) {
      console.error('Erreur recherche publications:', err);
      setError(err.response?.data?.message || 'Erreur lors de la recherche des publications');
      setPublicationResults([]);
      setPublicationsPagination(null);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTag]);

  // Débounce la recherche combinée
  useEffect(() => {
    const timer = setTimeout(() => {
      const query = searchQuery.trim();
      if (query.length >= 2 || selectedTag !== "Tous") {
        fetchUsers(1);
        fetchPublications(1);
      } else {
        setUserResults([]);
        setPagination(null);
        setPublicationResults([]);
        setPublicationsPagination(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, fetchUsers, fetchPublications]);

  // Fonction pour changer de page utilisateurs
  const handleUserPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      fetchUsers(newPage);
    }
  };

  // Fonction pour changer de page publications
  const handlePublicationPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (publicationsPagination?.pages || 1)) {
      fetchPublications(newPage);
    }
  };

  // Gestion du like
  const handleLike = async (pubId, e) => {
    e?.stopPropagation();
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const res = await api.post(`/publications/${pubId}/like/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLikedMap(prev => ({ ...prev, [pubId]: res.data.data.liked }));
        setPublicationResults(prev => prev.map(p =>
          p.id === pubId ? { ...p, nombre_likes: res.data.data.nombre_likes } : p
        ));
        if (focusedPub?.id === pubId) {
          setFocusedPub(prev => ({ 
            ...prev, 
            nombre_likes: res.data.data.nombre_likes,
            a_like: res.data.data.liked
          }));
        }
      }
    } catch (err) {
      console.error('Erreur like:', err);
    }
  };

  // Ouvrir le popup
  const handleOpenPopup = (pub) => {
    setFocusedPub(pub);
  };

  // Fermer le popup
  const handleClosePopup = () => {
    setFocusedPub(null);
  };

  return (
    <section className="w-screen h-screen bg-[#2d3a30] text-[#2d3a30] font-sans overflow-hidden flex flex-col md:flex-row relative">
      <PanneauRecherche 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        tags={SUGGESTED_TAGS}
      />

      <ResultatsGrille 
        isSearchActive={isSearchActive}
        results={publicationResults}
        userResults={userResults}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        pagination={pagination}
        publicationsPagination={publicationsPagination}
        onUserPageChange={handleUserPageChange}
        onPublicationPageChange={handlePublicationPageChange}
        onOpenPopup={handleOpenPopup}
        likedMap={likedMap}
        onLike={handleLike}
      />

      {/* Popup AperçuPublication */}
      <AnimatePresence>
        {focusedPub && (
          <AperçuPublication
            pub={focusedPub}
            liked={likedMap[focusedPub.id] ?? focusedPub.a_like}
            onLike={handleLike}
            onClose={handleClosePopup}
            theme={{
              bg: '#2d3a30',
              bgCard: '#38483c',
              bgDeep: '#1f2922',
              accentSage: '#aec3b0',
              ivory: '#f8f9f8'
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Recherche;