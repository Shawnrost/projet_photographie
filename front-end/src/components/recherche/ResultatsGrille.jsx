import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarteOeuvre from './CarteOeuvre';
import CarteUtilisateur from './CarteUtilisateur';
import PopupUtilisateur from './PopupUtilisateur';

const ResultatsGrille = ({ 
  isSearchActive, 
  results, 
  userResults, 
  loading, 
  error, 
  searchQuery,
  pagination,
  publicationsPagination,
  onUserPageChange,
  onPublicationPageChange,
  onOpenPopup,
  likedMap,
  onLike
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const hasResults = results.length > 0 || userResults.length > 0;
  const totalResults = results.length + userResults.length;

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div className="w-full md:w-3/5 h-3/5 md:h-full bg-[#f8f9f8] p-6 md:p-12 pt-16 md:pt-24 overflow-y-auto relative z-10 custom-scrollbar">
      {/* Header Statistique */}
      <div className="flex justify-between items-baseline border-b border-[#2d3a30]/10 pb-4 mb-6 select-none">
        <h2 className="font-serif text-xl md:text-2xl italic text-[#2d3a30]">
          {!isSearchActive 
            ? "En attente d'exploration" 
            : loading 
              ? "Recherche en cours..." 
              : hasResults 
                ? "Résultats de l'exploration"
                : "Aucun résultat"}
        </h2>
        {isSearchActive && !loading && (
          <span className="font-mono text-[9px] text-[#2d3a30]/50 uppercase tracking-widest">
            {pagination?.total + publicationsPagination?.total || totalResults} 
            {pagination?.total + publicationsPagination?.total > 1 ? ' résultats' : ' résultat'}
          </span>
        )}
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="h-4/5 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 mb-4"
          >
            <svg className="w-full h-full text-[#2d3a30]/20" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </motion.div>
          <p className="font-serif italic text-sm text-[#2d3a30]/40">
            Exploration de l'index en cours...
          </p>
        </div>
      )}

      {/* État d'erreur */}
      {!loading && error && (
        <div className="h-4/5 flex flex-col items-center justify-center text-center">
          <span className="text-2xl text-red-400/40 mb-2">⚠</span>
          <p className="font-serif italic text-sm text-red-400/60">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-xs font-mono tracking-wider uppercase text-[#2d3a30]/50 hover:text-[#2d3a30] transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Pas de recherche active */}
      {!isSearchActive && !loading && (
        <div className="h-4/5 flex flex-col items-center justify-center text-center opacity-40">
          <svg className="w-6 h-6 text-[#2d3a30] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
          <p className="font-serif italic text-sm">Saisissez un mot ou sélectionnez un filtre esthétique.</p>
        </div>
      )}

      {/* Résultats */}
      {!loading && !error && isSearchActive && (
        <AnimatePresence mode="wait">
          {hasResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 pb-12"
            >
              {/* Résultats utilisateurs */}
              {userResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] tracking-[0.3em] text-[#2d3a30]/40 uppercase select-none">
                    Utilisateurs ({pagination?.total || userResults.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userResults.map((user, index) => (
                      <CarteUtilisateur 
                        key={user.id} 
                        user={user} 
                        index={index}
                        onUserClick={handleUserClick}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination Utilisateurs */}
                  {pagination && pagination.pages > 1 && (
                    <PaginationControls 
                      pagination={pagination} 
                      onPageChange={onUserPageChange} 
                    />
                  )}
                </div>
              )}

              {/* Résultats publications (œuvres) */}
              {results.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] tracking-[0.3em] text-[#2d3a30]/40 uppercase select-none">
                    Œuvres ({publicationsPagination?.total || results.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {results.map((item) => {
                      // Ajouter l'état de like depuis likedMap
                      const itemWithLike = {
                        ...item,
                        a_like: likedMap[item.id] ?? item.a_like
                      };
                      return (
                        <CarteOeuvre 
                          key={item.id} 
                          item={itemWithLike} 
                          onOpenPopup={onOpenPopup}
                          onLike={onLike}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Pagination Publications */}
                  {publicationsPagination && publicationsPagination.pages > 1 && (
                    <PaginationControls 
                      pagination={publicationsPagination} 
                      onPageChange={onPublicationPageChange} 
                    />
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-4/5 flex flex-col items-center justify-center text-center"
            >
              <span className="text-2xl text-[#2d3a30]/20 mb-2">⊘</span>
              <p className="font-serif italic text-sm text-[#2d3a30]/60">
                Aucune archive ne correspond à vos critères.
              </p>
              <p className="font-mono text-[8px] text-[#2d3a30]/30 mt-2 uppercase tracking-wider">
                Essayez d'autres mots-clés
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Popup Utilisateur */}
      <AnimatePresence>
        {selectedUser && (
          <PopupUtilisateur 
            userData={selectedUser}
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
    </div>
  );
};

// Composant de pagination réutilisable
const PaginationControls = ({ pagination, onPageChange }) => (
  <div className="flex justify-center items-center gap-2 pt-4 border-t border-[#2d3a30]/10">
    <button
      onClick={() => onPageChange(pagination.page_actuelle - 1)}
      disabled={!pagination.precedente}
      className={`px-4 py-2 rounded-lg font-mono text-[9px] tracking-wider uppercase transition-all duration-300 ${
        pagination.precedente
          ? 'hover:bg-[#2d3a30] hover:text-white text-[#2d3a30]/70 border border-[#2d3a30]/20 hover:border-[#2d3a30]'
          : 'text-[#2d3a30]/20 cursor-not-allowed'
      }`}
    >
      Précédent
    </button>
    
    <span className="font-mono text-[9px] text-[#2d3a30]/50 px-4">
      Page {pagination.page_actuelle} / {pagination.pages}
    </span>
    
    <button
      onClick={() => onPageChange(pagination.page_actuelle + 1)}
      disabled={!pagination.suivante}
      className={`px-4 py-2 rounded-lg font-mono text-[9px] tracking-wider uppercase transition-all duration-300 ${
        pagination.suivante
          ? 'hover:bg-[#2d3a30] hover:text-white text-[#2d3a30]/70 border border-[#2d3a30]/20 hover:border-[#2d3a30]'
          : 'text-[#2d3a30]/20 cursor-not-allowed'
      }`}
    >
      Suivant
    </button>
  </div>
);

export default ResultatsGrille;