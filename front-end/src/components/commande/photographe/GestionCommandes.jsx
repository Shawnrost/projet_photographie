import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import CommandeAdminCard from './CommandeAdminCard';
import CommandeSkeleton from '../clients/CommandeSkeleton';

const CONFIG_THEME = {
  bg: '#2d3a30',
  bgCard: '#38483c',
  bgDeep: '#1f2922',
  accentSage: '#aec3b0',
  ivory: '#f8f9f8'
};

const FILTRES = [
  { value: '', label: 'Toutes' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'paye', label: 'Payées' },
  { value: 'annule', label: 'Annulées' }
];

const GestionCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [statutFiltre, setStatutFiltre] = useState('');
  const [recherche, setRecherche] = useState('');
  const [rechercheInput, setRechercheInput] = useState('');

  const fetchCommandes = useCallback(async (p = 1, statut = '', search = '') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: p, page_size: 10 });
      if (statut) params.set('status', statut);
      if (search) params.set('search', search);

      const res = await api.get(`/commandes/admin/?${params.toString()}`);
      if (res.data.success) {
        setCommandes(res.data.data || []);
        setPagination(res.data.pagination || null);
      }
    } catch (err) {
      console.error('Erreur récupération commandes:', err);
      setError('Impossible de charger les commandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommandes(page, statutFiltre, recherche);
  }, [page, statutFiltre, recherche, fetchCommandes]);

  const handleFiltreChange = (value) => {
    setStatutFiltre(value);
    setPage(1);
  };

  const handleRechercheSubmit = (e) => {
    e.preventDefault();
    setRecherche(rechercheInput.trim());
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (commandeId, newStatus) => {
    setCommandes((prev) =>
      prev.map((c) => (c.id === commandeId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <section className="w-screen h-screen bg-[#2d3a30] text-[#2d3a30] font-sans overflow-hidden flex flex-col md:flex-row relative">
      {/* Panneau gauche - Style Espace photographe / Admin */}
      <div className="w-full md:w-5/12 h-2/5 md:h-full p-8 md:p-16 pt-32 md:pt-44 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10 bg-[#2d3a30]">
        <div className="space-y-8 md:space-y-12 my-auto w-full max-w-md mx-auto md:mx-0">
          
          {/* EN-TÊTE TYPOGRAPHIQUE */}
          <div className="space-y-2 select-none">
            <span className="font-mono text-[9px] tracking-[0.5em] text-[#aec3b0] uppercase italic block opacity-80">
              Espace Gestion
            </span>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white tracking-wide leading-none font-light">
              Commandes<span className="text-[#aec3b0]">.</span>
            </h1>
          </div>

          {/* Filtres par statut */}
          <div className="space-y-4">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#aec3b0]/60 select-none">
              Filtrer par statut
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FILTRES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleFiltreChange(f.value)}
                  className={`px-4 py-3 rounded-2xl font-mono text-[9px] tracking-widest uppercase transition-all duration-500 ease-out border text-center ${
                    statutFiltre === f.value
                      ? 'bg-[#aec3b0] text-[#2d3a30] border-[#aec3b0] font-semibold shadow-[0_10px_25px_rgba(174,195,176,0.15)]'
                      : 'bg-white/[0.02] text-white/50 border-white/5 hover:text-white hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recherche */}
          <form onSubmit={handleRechercheSubmit} className="space-y-2">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#aec3b0]/60 select-none">
              Rechercher
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={rechercheInput}
                onChange={(e) => setRechercheInput(e.target.value)}
                placeholder="Nom ou email client..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs font-light placeholder:text-white/30 focus:outline-none focus:border-[#aec3b0]/50 transition-colors"
              />
              <button
                type="submit"
                style={{ backgroundColor: CONFIG_THEME.accentSage }}
                className="px-5 py-3 rounded-2xl text-[#2d3a30] text-[9px] tracking-wider uppercase font-bold hover:bg-white transition-all flex-shrink-0"
              >
                OK
              </button>
            </div>
          </form>

          {/* Indicateur d'état */}
          <div className="bg-[#aec3b0]/5 border border-[#aec3b0]/10 rounded-2xl p-4">
            <p className="font-mono text-[10px] text-[#aec3b0]/70 uppercase tracking-wider">
              {statutFiltre ? `Filtre : ${FILTRES.find(f => f.value === statutFiltre)?.label}` : 'Toutes les commandes'}
            </p>
            <p className="font-serif italic text-sm text-[#aec3b0]/50 mt-1">
              Gérez le statut des ventes de la plateforme
            </p>
          </div>
        </div>

        {/* FOOTER DISCRET */}
        <p className="hidden md:block font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] select-none">
          Gasy Ant'sary Galerie — Administration
        </p>
      </div>

      {/* Panneau droit - Liste des commandes */}
      <div className="w-full md:w-3/5 h-3/5 md:h-full bg-[#f8f9f8] p-6 md:p-12 pt-16 md:pt-24 overflow-y-auto relative z-10 custom-scrollbar">
        {/* Header du panneau droit */}
        <div className="flex justify-between items-baseline border-b border-[#2d3a30]/10 pb-4 mb-6 select-none">
          <h2 className="font-serif text-xl md:text-2xl italic text-[#2d3a30]">
            📋 Liste des ventes
          </h2>
          {pagination && (
            <span className="font-mono text-[9px] text-[#2d3a30]/50 uppercase tracking-widest">
              {pagination.total ?? commandes.length} commande(s)
            </span>
          )}
        </div>

        {/* Contenu */}
        {loading && <CommandeSkeleton theme={CONFIG_THEME} />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-2xl text-red-400/40 mb-2">⚠</span>
            <p className="text-[#2d3a30]/60 text-sm">{error}</p>
            <button
              onClick={() => fetchCommandes(page, statutFiltre, recherche)}
              className="mt-4 px-6 py-2 text-xs font-mono tracking-wider uppercase text-[#2d3a30]/40 hover:text-[#2d3a30] border border-[#2d3a30]/10 rounded-lg hover:border-[#2d3a30]/30 transition-all"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && commandes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-2xl text-[#2d3a30]/20 mb-2 block">📋</span>
            <p className="text-[#2d3a30]/40 text-sm font-serif italic">
              Aucune commande ne correspond à ces critères.
            </p>
          </div>
        )}

        {!loading && !error && commandes.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence>
              {commandes.map((commande, index) => (
                <CommandeAdminCard
                  key={commande.id}
                  commande={commande}
                  index={index}
                  theme={CONFIG_THEME}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-4 pt-6 border-t border-[#2d3a30]/10 mt-6"
          >
            <button
              disabled={!pagination.precedente}
              onClick={() => handlePageChange(pagination.page_actuelle - 1)}
              className="px-4 py-2 rounded-lg border border-[#2d3a30]/10 text-[#2d3a30]/40 text-[9px] tracking-wider uppercase hover:text-[#2d3a30] hover:border-[#2d3a30]/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            <span className="text-[#2d3a30]/30 text-[10px] tracking-[0.4em] font-mono">
              {pagination.page_actuelle}{' '}
              <span style={{ color: CONFIG_THEME.accentSage }} className="opacity-50">/</span>{' '}
              {pagination.pages}
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
    </section>
  );
};

export default GestionCommandes;