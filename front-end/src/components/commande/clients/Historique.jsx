import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import CommandeCard from './CommandeCard';
import CommandeSkeleton from './CommandeSkeleton';

const Historique = ({ theme }) => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const fetchHistorique = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/commandes/historique/?page=${p}&page_size=10`);
      if (res.data.success) {
        setCommandes(res.data.data || []);
        setPagination(res.data.pagination || null);
      }
    } catch (err) {
      console.error('Erreur récupération historique:', err);
      setError('Impossible de charger votre historique.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorique(page);
  }, [page, fetchHistorique]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setPage(newPage);
    }
  };

  // Header historique
  const HistoriqueHeader = () => (
    <div className="flex justify-between items-baseline border-b border-[#2d3a30]/10 pb-4 mb-6 select-none">
      <h2 className="font-serif text-xl md:text-2xl italic text-[#2d3a30]">
        📜 Historique
      </h2>
      {commandes.length > 0 && (
        <span className="font-mono text-[9px] text-[#2d3a30]/50 uppercase tracking-widest">
          {pagination?.total || commandes.length} commandes
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
          onClick={() => fetchHistorique(page)}
          className="mt-4 px-6 py-2 text-xs font-mono tracking-wider uppercase text-[#2d3a30]/40 hover:text-[#2d3a30] border border-[#2d3a30]/10 rounded-lg hover:border-[#2d3a30]/30 transition-all"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (commandes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <HistoriqueHeader />
        <div className="pt-8">
          <span className="text-2xl text-[#2d3a30]/20 mb-2 block">📜</span>
          <p className="text-[#2d3a30]/40 text-sm font-serif italic">Aucune commande dans votre historique.</p>
          <p className="text-[#2d3a30]/20 text-[10px] font-mono tracking-wider mt-2">Vos achats apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HistoriqueHeader />

      {/* Liste des commandes */}
      <div className="space-y-4">
        <AnimatePresence>
          {commandes.map((commande, index) => (
            <CommandeCard
              key={commande.id}
              commande={commande}
              index={index}
              theme={theme}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-4 pt-6 border-t border-[#2d3a30]/10"
        >
          <button
            disabled={!pagination.precedente}
            onClick={() => handlePageChange(pagination.page_actuelle - 1)}
            className="px-4 py-2 rounded-lg border border-[#2d3a30]/10 text-[#2d3a30]/40 text-[9px] tracking-wider uppercase hover:text-[#2d3a30] hover:border-[#2d3a30]/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          <span className="text-[#2d3a30]/30 text-[10px] tracking-[0.4em] font-mono">
            {pagination.page_actuelle} <span style={{ color: theme.accentSage }} className="opacity-50">/</span> {pagination.pages}
          </span>
          <button
            disabled={!pagination.suivante}
            onClick={() => handlePageChange(pagination.page_actuelle + 1)}
            className="px-4 py-2 rounded-lg border border-[#2d3a30]/10 text-[#2d3a30]/40 text-[9px] tracking-wider uppercase hover:text-[#2d3a30] hover:border-[#2d3a30]/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Historique; 