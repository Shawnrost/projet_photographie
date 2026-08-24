import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import ArticleItem from './ArticleItem';
import PanierVide from './PanierVide';
import CommandeSkeleton from './CommandeSkeleton';

const Panier = ({ theme }) => {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);

  const fetchPanier = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/commandes/panier/');
      if (res.data.success) {
        setPanier(res.data.data);
      }
    } catch (err) {
      console.error('Erreur récupération panier:', err);
      setError('Impossible de charger votre panier.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPanier();
  }, [fetchPanier]);

  const handleRetirer = async (publicationId) => {
    try {
      const res = await api.post('/commandes/panier/retirer/', {
        publication_id: publicationId
      });
      
      if (res.data.success) {
        setPanier(res.data.data);
      }
    } catch (err) {
      console.error('Erreur retrait:', err);
      setError('Impossible de retirer cet article.');
    }
  };

  const handleVider = async () => {
    if (!window.confirm('Voulez-vous vraiment vider votre panier ?')) return;
    
    try {
      const res = await api.delete('/commandes/panier/vider/');
      if (res.data.success) {
        setPanier(null);
      }
    } catch (err) {
      console.error('Erreur vidage:', err);
      setError('Impossible de vider le panier.');
    }
  };

  const handleValider = async () => {
    setValidationLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/commandes/panier/');
      
      if (res.data.success) {
        alert('Commande passée avec succès !');
        setPanier(null);
        fetchPanier();
      }
    } catch (err) {
      console.error('Erreur validation:', err);
      setError(err.response?.data?.message || 'Erreur lors de la validation.');
    } finally {
      setValidationLoading(false);
    }
  };

  // Header du panier (style adapté)
  const PanierHeader = () => (
    <div className="flex justify-between items-baseline border-b border-[#2d3a30]/10 pb-4 mb-6 select-none">
      <h2 className="font-serif text-xl md:text-2xl italic text-[#2d3a30]">
        🛒 Mon Panier
      </h2>
      {panier && panier.articles?.length > 0 && (
        <span className="font-mono text-[9px] text-[#2d3a30]/50 uppercase tracking-widest">
          {panier.articles.length} {panier.articles.length > 1 ? 'articles' : 'article'}
        </span>
      )}
    </div>
  );

  if (loading) {
    return <CommandeSkeleton theme={theme} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-2xl text-red-400/40 mb-2">⚠</span>
        <p className="text-[#2d3a30]/60 text-sm">{error}</p>
        <button
          onClick={fetchPanier}
          className="mt-4 px-6 py-2 text-xs font-mono tracking-wider uppercase text-[#2d3a30]/40 hover:text-[#2d3a30] border border-[#2d3a30]/10 rounded-lg hover:border-[#2d3a30]/30 transition-all"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!panier || panier.articles?.length === 0) {
    return <PanierVide theme={theme} />;
  }

  return (
    <div className="space-y-6">
      <PanierHeader />

      {/* Résumé du panier */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl border border-[#2d3a30]/5 bg-[#2d3a30]/[0.02]">
        <div>
          <p className="text-[#2d3a30]/40 text-[10px] font-mono tracking-wider uppercase">
            Total à payer
          </p>
          <p style={{ color: theme.accentSage }} className="text-2xl font-serif italic font-light mt-1">
            {parseFloat(panier.prix_a_payer).toFixed(2)} Ar
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleVider}
            className="px-4 py-2 rounded-lg border border-[#2d3a30]/10 text-[#2d3a30]/40 text-[9px] tracking-wider uppercase hover:text-[#2d3a30] hover:border-[#2d3a30]/30 transition-all"
          >
            Vider
          </button>
          <button
            onClick={handleValider}
            disabled={validationLoading}
            style={{ backgroundColor: theme.accentSage }}
            className="px-6 py-2 rounded-lg text-[#2d3a30] text-[9px] tracking-wider uppercase font-bold hover:bg-[#2d3a30] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validationLoading ? 'Validation...' : 'Valider le panier'}
          </button>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="space-y-4">
        <AnimatePresence>
          {panier.articles.map((article, index) => (
            <ArticleItem
              key={article.id}
              article={article}
              index={index}
              onRetirer={handleRetirer}
              theme={theme}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Panier;